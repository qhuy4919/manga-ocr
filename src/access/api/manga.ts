import { axiosClient } from './axios';

export const mangaAPI = {
    getTextFromImage: (data: Record<string, any>) => {
        const url = '/';

        return axiosClient.post(url, data);
    },
    translateText: (text: string, destinationLang: string) => {
        const url = 'https://microsoft-translator-text.p.rapidapi.com/translate/';
        const config = {
            params: {
                'to[0]': destinationLang,
                'api-version': '3.0',
                profanityAction: 'NoAction',
                textType: 'plain'
              },
              headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': 'a55d5e893fmsh0fd95b8d27c9424p14d7c7jsn6b1449cfae02',
                'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
              },
        }
        const data = [
            {
              Text: text,
            }
          ]

        return axiosClient.post(url, data, config);
    },
    detextAllBox: (data: Record<string, any>) => {
      const url = '/';
      return axiosClient.post(url, data);
    }
    
}