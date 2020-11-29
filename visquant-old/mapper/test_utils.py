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

    def compare_markup_lists(self, expected, actual):
        self.assertEqual(len(expected), len(actual))
        for index, markup in enumerate(expected):
            # Output list must contain lineColour attribute for drawing
            self.assertTrue("lineColour" in actual[index])
            for key in markup.keys():
                self.assertEqual(expected[index][key], actual[index][key])

    def test_to_markup_list_simple(self):
        csv_file = """
        accession,type,site
        bsn_rat,phosphorylation,105
        bsn_rat,phosphorylation,130
        bsn_rat,glycosylation,142
        """.split()
        expected = [
            {"accession": "bsn_rat", "type": "phosphorylation", "start": 105},
            {"accession": "bsn_rat", "type": "phosphorylation", "start": 130},
            {"accession": "bsn_rat", "type": "glycosylation", "start": 142},
        ]
        self.compare_markup_lists(expected, utils.to_markup_list(csv_file))

    def test_multisite_markup(self):
        csv_file = """
        accession,type,site
        bsn_rat,phosphorylation,105
        bsn_rat,phosphorylation,105;120
        bsn_rat,glycosylation,142;144;149
        """.split()
        expected = [
            {"accession": "bsn_rat", "type": "phosphorylation", "start": 105},
            {"accession": "bsn_rat", "type": "phosphorylation", "start": 105},
            {"accession": "bsn_rat", "type": "phosphorylation", "start": 120},
            {"accession": "bsn_rat", "type": "glycosylation", "start": 142},
            {"accession": "bsn_rat", "type": "glycosylation", "start": 144},
            {"accession": "bsn_rat", "type": "glycosylation", "start": 149},
        ]
        self.compare_markup_lists(expected, utils.to_markup_list(csv_file))

    def test_multisite_markup_with_multiple_type(self):
        csv_file = """
        accession,type,site
        bsn_rat,phosphorylation;phosphorylation,100;102
        bsn_rat,glycosylation;phosphorylation,142;144
        """.split()
        expected = [
            {"accession": "bsn_rat", "type": "phosphorylation", "start": 100},
            {"accession": "bsn_rat", "type": "phosphorylation", "start": 102},
            {"accession": "bsn_rat", "type": "glycosylation", "start": 142},
            {"accession": "bsn_rat", "type": "phosphorylation", "start": 144},
        ]
        self.compare_markup_lists(expected, utils.to_markup_list(csv_file))


if __name__ == "__main__":
    unittest.main()
