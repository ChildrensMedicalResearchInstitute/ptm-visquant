
## Submitting your data

### Protein Entry Name or Accession

Specify a protein of interest using the UniProt entry name or accession (for example, BSN_RAT or O88778). Proteins entries are restricted to the UniProt release currently being used by Pfam, which provides the evolutionarily conserved domain information.

A single value may be specified. For example:

```
BSN_RAT
```

More than one protein can be displayed by separating the values with a comma.

```
BSN_RAT,TAU_RAT
```

A valid UniProt entry must be supplied in this field.

### Post-translational modifications input file

Your post-translational modification site information must be provided via a file in CSV (comma-separated value) format. The application will use this information for display on the evolutionarily conserved protein domain structure diagram.

The first line of the CSV file should be a header which identifies the information which can be found in each column. Each following line will define a new peptide-centric datum, optional information on how the information is displayed, and optional quantitative data.

|Column name|Required|Description|
|:-|:-|:-|
|`accession`|Yes|The UniProt protein entry name or protein accession. If the entry name/accession value specified does not match an entry name/accession provided under the ‘Protein Entry Name or Accession’ in the Home page, this row will be ignored.|
|`site`|Yes|A semicolon-delimited list of integers representing the sites of the modification(s) on the peptide. For example: `110` or `110;122;140` which represent unique peptides mono-modified at 110 or triply-modified at 110, 122 and 140 respectively.|
|`type`|Yes|A semicolon-delimited list of strings representing the type of modification on the peptide. For example: `phosphorylation`, or `phosphorylation;glycosylation`. User supplied substrates (sites) and enzymatic reactions (type) are not checked for substrate-enzyme compatibility.|
|`lineColour`||A semicolon-delimited list of strings representing the colour used to draw the modification. The colour can be any valid HTML colour name or hexadecimal. For example: `purple`, `purple;red`, or `lightcoral;#AA00FF`.If unspecified, a random colour will be assigned to each unique value specified in `type` column.|
|`intensity_*`||A single numerical value to quantify the amount of modification on the peptide. Intensity columns will be processed in the order in which they are specified. This column may be repeated as many times as necessary for each set of heatmap values. Display modes are optimised for log transformed ratio data to display up and down regulated PTMs.|

Here is a short example of a CSV file which includes only the required fields.

```
accession,site,type
tau_rat,105,phosphorylation
tau_rat,189;200,phosphorylation;glycosylation
```

Here is a quick example of another CSV file which includes all fields.

```
accession,site,type,lineColour,intensity_trial_1,intensity_trial_2,intensity_trial_3,intensity_trial_4,intensity_trial_5
syn3_rat,118,phosphorylation,#FE4EDA,1.437837,0.9898816,0.1745114,0.4425308,0.09422488
syn3_rat,130;140,phosphorylation;phosphorylation,#FE4EDA;#FE4EDA,-0.8414064,-0.4202376,0.2043132,0.1221804,0.9935178
```

If `type` and `lineColour` is consistent across many modifications on a peptide, they only need to be specified once.

```
accession,site,type,lineColour
syn1_rat,240;287;290,phosphorylation,lightgreen
```

In the example above, there are many modification sites listed, however only one type and lineColour is specified. In cases like these, the type and lineColour values will be repeated for all modification sites specified on that line.

[Download an example CSV file](/example-csv) to experiment with the schema. This example CSV will generate [this view](/example).

#### My data is from MaxQuant and is site-centric. How do I make it peptide-centric?

This tool is deliberately designed for peptide-centric data since all proteomics-based quantitative data is peptide-centric. The site tables from MaxQuant are in the format of one site per row. However, the intensity data for each row can be from mono- or multiply modified peptides.

When displaying quantitative information, we suggest either (a) extracting the multi-site information using knowledge of your protein sequence, site localisation probabilities and the ‘modified sequence’ column to convert your table to our CSV format, or (b) ordering your rows such that the number of modifications is known to you (e.g., sort the ‘Number of …’ column from lowest to highest). You may then supply the multiplicity of modification information by editing the image file produced from this tool. An alternative is to process the MaxQuant ‘evidence’ file to derive a peptide-centric table.

In the future, we may provide a file format conversion tool or display option to achieve these suggestions.
