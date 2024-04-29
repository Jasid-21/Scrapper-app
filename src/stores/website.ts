import { defineStore } from "pinia";
import WebsiteState from "./interfaces/websiteState.interface";
import FetchPage from "@/services/FetchPage.service";

export const useWebsiteStore = defineStore('website', {
  state: (): WebsiteState => ({
    base_url: '',
    content: '',
    styles: [],
    iframe_document: undefined,
  }),

  actions: {
    setIframeDoc(document: Document) {
      if (!(document instanceof Document)) return;
      this.iframe_document = document;
    },

    setContent(content: string) {
      if (typeof content != 'string') return;
      this.content = content;
    },

    setStyles(styles: string[], add: boolean = false) {
      if (styles.some(s => typeof s != 'string')) return;
      if (add) {
        this.styles.push(...styles);
        return;
      }
      this.styles = styles;
    },

    setWebsite(content: string, styles: string[]) {
      //const style_tags = styles.map(s => `<style>${s}</style>`);
      this.setContent(content);
      this.setStyles(styles);
    },

    fetchPage(url: string) {
      if (typeof url != 'string') return;

      FetchPage(url).then(({ content, styles }) => {
        this.setWebsite(content, styles);
        this.setBaseUrl(url);
      }).catch(err => console.log(err));
    },

    setBaseUrl(url: string) {
      const url_array = url.split('/').splice(0, 3);
      this.base_url = url_array.join('/');
    }
  }
});
