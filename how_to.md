## How to use PTM Mapper

##### Protein Entry Name or Accession

Specify a protein of interest using the UniProt entry name or accession (for example, BSN_RAT or O88778). Proteins entries are restricted to the UniProt release currently being used by Pfam, which provides the evolutionarily conserved domain information.

A valid UniProt entry must be supplied in this field.

##### Post-translational modifications file

Your post-translational modification site information must be provided via a file in CSV (comma-separated value) format. The application will use this information for display on the evolutionarily conserved protein domain structure diagram.

The first line of the CSV file should be a header which identifies the information which can be found in each column. Each line following the header will define a new post-translational modification site and optional information on how the information is displayed and quantitative data.

|Column name|Required|Description|
|:-|:-|:-|
|`accession`|Yes|The protein entry name or accession code where this markup belongs. If the accession value specified in the CSV file does not match any accession in the diagram, the markup will not be drawn.|
|`type`|Yes|Type of markup (for example: phosphorylation).|
|`start`|Yes|The start coordinate of the markup. Must be an integer with a minimum value of zero.|
|`display`||A `true` or `false` value denoting whether the markup should be displayed on the graphic. If unspecified, the markup will default to `true`.|
|`lineColour`||Colour of markup line. This field accepts any valid HTML colour name or hexadecimal. If unspecified, a random colour will be assigned to each unique value specified in the `type` column.|
|`heatmap_*`||A numerical value to quantify an amount of some modification. Columns will be collapsed into the heatmap in the order in which they are specified. This column may be repeated as many times as necessary for each set of heatmap values.|

An example CSV file which includes only the required fields.

```
accession,type,start
bsn_rat,phosphorylation,105
bsn_rat,phosphorylation,189
not_rat,phosphorylation,141
```

Another CSV file which includes most fields.

```
accession,type,start,lineColour,heatmap_trial_1,heatmap_trial_2,heatmap_trial_3,heatmap_trial_4,heatmap_trial_5
bsn_rat,phosphorylation,105,#FE4EDA,0.561635184,0.972558412,0.88684033,0.595734213,0.805348794
bsn_rat,phosphorylation,189,#FE4EDA,0.748295273,0.356942776,0.691517186,0.332498155,0.5100571
not_rat,phosphorylation,141,green,0.996835935,0.761265635,0.74546531,0.285868099,0.513450914
```

[Download example CSV file](/example-csv). This CSV will generate this [example view](/example).

## Contact us

For any enquiries, please send us an email to [questions@cmri.org.au](mailto:questions@cmri.org.au).
