import copy
import json
import subprocess
import sys
import tempfile
import unittest
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import knowledge
import validate


def question():
    return {
        "id": "Q-2026-001", "type": "research_question",
        "created_at": "2026-08-31T12:00:00+00:00", "question": "Which report confirms the role?",
        "evidence_needed": "A dated official report", "review_on": "2026-09-01", "status": "open", "reviews": [],
    }


def review(result="answered"):
    return {"reviewed_at": "2026-09-01T12:00:00+00:00", "result": result,
            "summary": "Official public report supplies the relevant evidence, with uncertainty noted.",
            "public_sources": ["https://www.nfl.com/news/example"]}


def hypothesis():
    value = question()
    value.pop("question")
    value.pop("evidence_needed")
    value.update(id="H-2026-001", type="hypothesis", claim="A measurable fictional forecast",
                 evidence_cutoff="2026-08-31T11:00:00+00:00",
                 scope={"season": 2026, "weeks": [1], "scoring_assumptions": "No point score; compare target counts"},
                 public_sources=["https://www.nfl.com/news/example"], measurement="Compare recorded target counts",
                 baseline="Prior game's count", confidence="Low", invalidation_conditions=[])
    return value


class LedgerTests(unittest.TestCase):
    def test_evidence_urls_reject_private_reserved_and_credentialed_hosts(self):
        for url in ("https://localhost/private", "https://127.0.0.1/report", "https://10.1.2.3/report", "https://[::1]/report", "https://100.64.0.1/report", "https://report.local/page", "https://report.internal/page", "https://user:pass" + "@" + "example.com/report"):
            with self.subTest(url=url), self.assertRaises(ValueError):
                knowledge.public_urls([url])
        knowledge.public_urls(["https://www.nfl.com/news/example"])

    def test_question_requires_cited_review_to_close(self):
        value = question()
        value["status"] = "answered"
        with self.assertRaises(ValueError):
            knowledge.validate_ledger([value], "research_question")
        value["reviews"] = [review()]
        knowledge.validate_ledger([value], "research_question")
        value["reviews"][0]["public_sources"] = []
        with self.assertRaises(ValueError):
            knowledge.validate_ledger([value], "research_question")

    def test_duplicate_ids_and_wrong_status_are_rejected(self):
        with self.assertRaises(ValueError):
            knowledge.validate_ledger([question(), question()], "research_question")
        value = question()
        value["reviews"] = [review()]
        with self.assertRaises(ValueError):
            knowledge.validate_ledger([value], "research_question")

    def test_review_chronology_and_timezones(self):
        value = question()
        value["reviews"] = [review("open")]
        for invalid in ("2026-08-30T12:00:00+00:00", "2026-09-01T12:00:00"):
            value["reviews"][0]["reviewed_at"] = invalid
            with self.assertRaises(ValueError):
                knowledge.validate_ledger([value], "research_question")

    def test_hypothesis_preserves_pre_outcome_cutoff_and_scope(self):
        value = hypothesis()
        knowledge.validate_ledger([value], "hypothesis")
        value["evidence_cutoff"] = "2026-09-02T12:00:00+00:00"
        with self.assertRaises(ValueError):
            knowledge.validate_ledger([value], "hypothesis")
        value = hypothesis()
        value["scope"]["weeks"] = []
        with self.assertRaises(ValueError):
            knowledge.validate_ledger([value], "hypothesis")

    def test_review_append_allowed_but_rewrite_or_delete_rejected(self):
        previous = question()
        previous["reviews"] = [review("open")]
        current = copy.deepcopy(previous)
        current["reviews"].append({**review(), "reviewed_at": "2026-09-02T12:00:00+00:00"})
        current["status"] = "answered"
        knowledge.compare_ledger([previous], [current])
        for key in ("question", "created_at"):
            changed = copy.deepcopy(current)
            changed[key] = "rewritten"
            with self.assertRaises(ValueError):
                knowledge.compare_ledger([previous], [changed])
        current["reviews"][0]["summary"] = "rewritten history"
        with self.assertRaises(ValueError):
            knowledge.compare_ledger([previous], [current])
        with self.assertRaises(ValueError):
            knowledge.compare_ledger([previous], [])

    def test_due_queue_does_not_score_questions_as_predictions(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "research").mkdir()
            (root / "research/questions.json").write_text(json.dumps([question()]))
            value = knowledge.report(root, date(2026, 9, 1))
            self.assertEqual(value["due"][0]["id"], "Q-2026-001")
            self.assertEqual(value["ledgers"]["hypotheses.json"]["records"], 0)
            self.assertIn("not forecast wins", value["note"])


class LinkTests(unittest.TestCase):
    def test_angle_bracket_links_support_spaces_and_reference_definitions(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "My Guide.md").write_text("# Guide\n")
            (root / "README.md").write_text('[guide](<My Guide.md>)\n\n[reference]: <My Guide.md> "Guide"\n')
            self.assertEqual(knowledge.validate_links(root), 2)

    def test_publication_rejects_directory_and_dangling_symlinks(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "target").mkdir()
            (root / "linked-directory").symlink_to(root / "target", target_is_directory=True)
            with self.assertRaises(ValueError):
                validate.validate_repo(root)
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "dangling").symlink_to(root / "missing")
            with self.assertRaises(ValueError):
                validate.validate_repo(root)

    def test_relative_links_code_examples_and_missing_targets(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "target.md").write_text("# Target\n")
            doc = root / "README.md"
            doc.write_text("[target](target.md#section)\n```md\n[example](not-real.md)\n```\n")
            self.assertEqual(knowledge.validate_links(root), 1)
            doc.write_text("[missing](missing.md)\n")
            with self.assertRaises(ValueError):
                knowledge.validate_links(root)


class HistoryTests(unittest.TestCase):
    def test_immutable_snapshots_and_append_only_dated_research(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            subprocess.run(["git", "init", "-q", str(root)], check=True)
            for relative, content in (("data/snapshots/one.json", "{}\n"), ("research/2026-08-31.md", "# Original\n"), ("research/questions.json", json.dumps([question()]))):
                path = root / relative
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text(content)
            subprocess.run(["git", "-C", str(root), "add", "."], check=True)
            subprocess.run(["git", "-C", str(root), "-c", "user.name=Tests", "-c", "user.email=tests@users.noreply.github.com", "-c", "commit.gpgsign=false", "commit", "-qm", "fixture"], check=True)
            self.assertEqual(knowledge.preserve_history(root, "HEAD"), 3)
            note = root / "research/2026-08-31.md"
            note.write_text("# Original\n\n## Dated correction\nNew evidence.\n")
            knowledge.preserve_history(root, "HEAD")
            note.write_text("# Rewritten\n")
            with self.assertRaises(ValueError):
                knowledge.preserve_history(root, "HEAD")
            note.write_text("# Original\n")
            (root / "data/snapshots/one.json").write_text('{"changed": true}\n')
            with self.assertRaises(ValueError):
                knowledge.preserve_history(root, "HEAD")

    def test_untrusted_ref_is_rejected_without_running_git(self):
        with self.assertRaises(ValueError):
            knowledge.preserve_history(Path("."), "--help")


if __name__ == "__main__":
    unittest.main()
