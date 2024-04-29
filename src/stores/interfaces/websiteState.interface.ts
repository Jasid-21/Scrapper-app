export default interface WebsiteState {
  content: string;
  styles: string[];
  base_url: string;
  iframe_document: Document | undefined;
}
