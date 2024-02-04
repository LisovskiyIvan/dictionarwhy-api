import tr from "googletrans";


interface Result {
    // the translated text.
    text: string;
  
    // array of the translated text.
    textArray: string[];
  
    // pronunciation
    pronunciation: string;
  
    // has correct source language?
    hasCorrectedLang: boolean;
  
    // source language
    src: string;
  
    // has correct source text?
    hasCorrectedText: boolean;
  
    // correct source text
    correctedText: string;
  
    // multiple translations
    translations: [];
  
    // the raw response from Google Translate servers.
    raw: [];
  }


export async function translate(text: string, src: string, dest: string) {
    return await tr(text, { from: src, to: dest }).then((res: Result) => res.text)
}