import ImgGetter from "@/classes/getters/ImgGetter.class";
import LinkGetter from "@/classes/getters/LinkGetter.class";
import PrimaryGetter from "@/classes/getters/PrimaryGetter.class";
import TextGetter from "@/classes/getters/TextGetter.class";
import GetterName from "@/types/GetterName.type";

export const getters: Record<GetterName, PrimaryGetter> = {
  Text: new TextGetter(),
  Img: new ImgGetter(),
  Link: new LinkGetter(),
};
