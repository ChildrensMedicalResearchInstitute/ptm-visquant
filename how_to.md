## How to use PTM Mapper

#### Protein Entry Name or Accession

Specify a protein of interest by the protein's UniProt entry name or accession code. You can find a comprehensive and searchable list proteins with their corresponding entry name and accession code available on the UniProt website: https://www.uniprot.org/uniprot/.

The UniProt database is used to validate any input into this field. Protein motif and domain information is sourced from PFAM: http://pfam.xfam.org.

#### Post-translational modifications file

One may optionally upload a post-translational modifications file in CSV format. The application will attempt to convert this information to markup for visualisation on the protein diagram.

The first line of the CSV file should be a header which identifies the information which can be found in each column. Each line following the header will define a new protein markup.

|Column name|Required|Description|
|-:|:-:|:-|
|`type`|Yes|Type of markup (for example: phosphorylation). Must be at least 1 character in length.|
|`colour`|No|Colour of markup region. Useful if markup spans a region along the protein. This field accepts any valid HTML colour name or hexadecimal.|
|`lineColour`|No|Colour of markup line. Useful if the markup starts and ends at the same coordinate along the protein. This field accepts any valid HTML colour name or hexadecimal.|
|`start`|Yes|The start coordinate of the markup. Must be an integer with a minimum value of zero.|
|`end`|No|The end coordinate of the markup. If this field is not specified, then the markup will end at the start coordinate. Must be an integer with a minimum value of zero.|
|`display`|No|A `true` or `false` value denoting whether the markup should be displayed on the graphic.|
|`heatmap_*`|No|Numerical value between 0 and 1 (inclusive) to quantify amount modified. Columns will be collapsed into the heatmap in the order in which they are specified.|
