import shareThis from "share-this";
import * as twitterSharer from "share-this/dist/sharers/twitter";

const selectionShare = shareThis({
  selector: ".md",
  sharers: [twitterSharer],
});

if (!window.matchMedia || !window.matchMedia("(pointer: coarse)").matches) {
  selectionShare.init();
}
