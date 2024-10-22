import { format } from 'date-fns';

// Pour les objets et les tableaux d'objets
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseStringDatesToJavascriptDates(array: Array<any>, propertiesToConvert: Array<string>) {
  for (const object of array) {
    if (object !== undefined && object !== null) {
      for (const [key, value] of Object.entries(object)) {
        if (!value) continue;
        if (propertiesToConvert.includes(key) && typeof value === 'string') object[key] = new Date(value);
        else if (propertiesToConvert.includes(key) && typeof value === 'object') {
          if (Object.prototype.toString.call(value) === '[object Array]') {
            parseStringDatesToJavascriptDates(value as [], propertiesToConvert);
          } else parseStringDatesToJavascriptDates([value], propertiesToConvert);
        }
      }
    }
  }
}

export function useDateUtils() {
  return {
    parseStringDatesToJavascriptDates,
    dateToStringJJMMAAAA(date: Date | undefined) {
      if (!date) return date;
      return format(date, 'dd/MM/yyyy');
    },
    dateToStringJJMMAAAAHHMMSS(date: Date | undefined) {
      if (!date) return date;
      return format(date, 'dd/MM/yyyy HH:mm:ss');
    },
  };
}
