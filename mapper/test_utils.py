import unittest
from . import utils


class TestUtils(unittest.TestCase):
    def test_split_accessions(self):
        testcases = {
            "BSN_RAT": ["BSN_RAT"],
            "BSN_RAT ": ["BSN_RAT"],
            "a,b": ["a", "b"],
            "a, b": ["a", "b"],
            "a, b, c, d": ["a", "b", "c", "d"],
        }
        for test_in, test_out in testcases.items():
            self.assertEqual(test_out, utils.split_accessions(test_in))

    def test_get_protein_domains(self):
        accessions = ["BSN_RAT", "P88778", "P03311", "P01137"]
        domain_info = utils.get_protein_domains(accessions)
        for protein in domain_info:
            self.assertTrue(protein)

        accessions = ["NOT_RAT", "NOT_ACCESSION"]
        domain_info = utils.get_protein_domains(accessions)
        for protein in domain_info:
            self.assertFalse(protein)


if __name__ == "__main__":
    unittest.main()
