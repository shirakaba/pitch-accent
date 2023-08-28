from fugashi import GenericTagger
import unidic
from argparse import ArgumentParser

parser = ArgumentParser(
    prog="unidic",
    description="Tokenise using UniDic",
)

parser.add_argument(
    "--i",
    dest="text",
    type=str,
    required=True,
    help="The input text, split into lines.",
)

args = parser.parse_args()
text = args.text
tagger = GenericTagger('-d "{}"'.format(unidic.DICDIR))

surfaces = []

for line in text.splitlines():
    for word in tagger(line):
        feature = word.feature

        # In populated entries (ones with more than 6 feature columns), the last
        # two columns are just feature weights, so are not of interest.
        if len(feature) > 6:
            feature = feature[0:-2]

        surfaces.append(word.surface + "," + ",".join(feature))
    surfaces.append("===")
print("\n".join(surfaces[0:-1]))
