import { describe, expect, test } from 'vitest';
import { useDateUtils } from '@/utils/DateUtils';

describe('useDateUtils', () => {
  // dateToStringJJMMAAAA()
  test('should parse date to string format JJ/MM/AAAA', () => {
    const dateUtils = useDateUtils();
    const parsedDate = dateUtils.dateToStringJJMMAAAA(new Date('2021-09-12T00:00:00'));

    expect(parsedDate).toBe('12/09/2021');

    const wrongDate = dateUtils.dateToStringJJMMAAAA(undefined);

    expect(wrongDate).toBeUndefined();
  });

  // parseStringDatesToJavascriptDates()
  test('should parse string dates to javascript dates', () => {
    const dateUtils = useDateUtils();

    const dataTest = [
      {
        date: '2022-08-29T00:00:00',
        nestedObject: {
          nestedObjectDate: '2022-08-28T00:00:00',
        },
      },
    ];

    dateUtils.parseStringDatesToJavascriptDates(dataTest, ['date', 'nestedObject', 'nestedObjectDate']);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((dataTest[0].date as any) instanceof Date).toBe(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((dataTest[0].nestedObject.nestedObjectDate as any) instanceof Date).toBe(true);
  });

  // dateToStringJJMMAAAAHHMMSS()
  test('should parse date to string format JJ/MM/AAAA HH:MM:SS', () => {
    const dateUtils = useDateUtils();
    const parsedDate = dateUtils.dateToStringJJMMAAAAHHMMSS(new Date('2022-09-02T09:33:21'));

    expect(parsedDate).toBe('02/09/2022 09:33:21');

    const wrongDate = dateUtils.dateToStringJJMMAAAAHHMMSS(undefined);

    expect(wrongDate).toBeUndefined();
  });
});
