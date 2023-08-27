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
        surfaces.append(word.surface)
    surfaces.append("===")
print("\n".join(surfaces[0:-1]))
