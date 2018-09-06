import unittest
from . import utils


class TestUtils(unittest.TestCase):
    def test_split_accessions_single_value(self):
        self.assertEqual(["bsn_rat"], utils.split_accessions("bsn_rat"))
        self.assertEqual(["BSN_RAT"], utils.split_accessions("BSN_RAT"))

    def test_split_accessions_single_value_with_spaces(self):
        self.assertEqual(["BSN_RAT"], utils.split_accessions("BSN_RAT "))
        self.assertEqual(["BSN_RAT"], utils.split_accessions(" BSN_RAT"))

    def test_split_accessions_multiple_values(self):
        self.assertEqual(["a", "b"], utils.split_accessions("a,b"))
        self.assertEqual(["a", "b", "c", "d"],
                         utils.split_accessions("a,b,c,d"))

    def test_split_accessions_multiple_values_with_spaces(self):
        self.assertEqual(["a", "b"], utils.split_accessions("a, b"))
        self.assertEqual(["a", "b", "c", "d"],
                         utils.split_accessions("a, b, c, d"))

    def test_split_accessions_empty_terms(self):
        self.assertEqual(["a", "b"], utils.split_accessions("a,,b"))
        self.assertEqual(["a", "b"], utils.split_accessions("a,b,"))

    def test_get_protein_domains_by_accession(self):
        accessions = ["O88778"]
        domain_info = utils.get_protein_domains(accessions)
        for protein in domain_info:
            self.assertTrue(protein)

    def test_get_protein_domains_by_entry_name(self):
        accessions = ["BSN_RAT"]
        domain_info = utils.get_protein_domains(accessions)
        for protein in domain_info:
            self.assertTrue(protein)

    def test_get_protein_domains_no_graphic_endpoint(self):
        accessions = ["P88778", "P03311"]
        domain_info = utils.get_protein_domains(accessions)
        for protein in domain_info:
            self.assertTrue(protein)

    def test_get_protein_domains_non_existent_protein(self):
        accessions = ["NOT_RAT", "NOT_ACCESSION"]
        domain_info = utils.get_protein_domains(accessions)
        for protein in domain_info:
            self.assertFalse(protein)


if __name__ == "__main__":
    unittest.main()
