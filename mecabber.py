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
    help="The input text.",
)

args = parser.parse_args()
text = args.text
tagger = GenericTagger('-d "{}"'.format(unidic.DICDIR))

# MeCab feature lists are sometimes shorter than the full possible length (e.g.
# when dictionary data is missing for the token). If the feature list doesn't
# include a column for the accent, that's a sure sign that we're dealing with a
# shortened token.
accent_index = 24

for word in tagger(text):
    feature = word.feature

    # When we have a full-length feature list, we'll cut off the last two
    # columns which are just feature weights and not of use to us.
    if len(feature) > accent_index:
        feature = feature[: len(feature) - 2]

    # Print out in a format easy to copy-paste into our test cases.
    print("'" + word.surface + "," + ",".join(feature) + "',")
