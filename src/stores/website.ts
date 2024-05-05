import { defineStore } from "pinia";
import WebsiteState from "./interfaces/websiteState.interface";
import FetchPage from "@/services/FetchPage.service";
import ToolName from "@/types/ToolName.type";

export const useWebsiteStore = defineStore('website', {
  state: (): WebsiteState => ({
    base_url: '',
    content: '',
    focused_el: null,
    clicked_el: null,
    context: null,
  }),

  actions: {
    setContext(context: Document | null) {
      this.context = context;
    },

    removeElementFromIframe() {
      if (!this.clicked_el) return;
      this.clicked_el.remove();
    },

    setClickedElement(el?: Element | null) {
      if (el === undefined) {
        this.clicked_el = this.focused_el;
        return;
      }
      this.clicked_el = el;
    },

    setFocusedElement(el: Element | null) {
      this.focused_el = el;
    },

    setContent(content: string) {
      if (typeof content != 'string') return;
      this.content = content;
    },

    setWebsite(content: string, styles: string[]) {
      this.setContent(content);
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
