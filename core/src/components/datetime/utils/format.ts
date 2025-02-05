import type { DatetimeParts } from '../datetime-interface';

const get12HourTime = (hour: number) => {
  return hour % 12 || 12;
};

const getFormattedAMPM = (ampm?: string) => {
  if (ampm === undefined) {
    return '';
  }

  return ampm.toUpperCase();
};

export const getFormattedTime = (refParts: DatetimeParts, use24Hour: boolean): string => {
  if (refParts.hour === undefined || refParts.minute === undefined) {
    return 'Invalid Time';
  }

  const hour = use24Hour ? getFormattedHour(refParts.hour, use24Hour) : get12HourTime(refParts.hour);
  const minute = addTimePadding(refParts.minute);

  if (use24Hour) {
    return `${hour}:${minute}`;
  }

  return `${hour}:${minute} ${getFormattedAMPM(refParts.ampm)}`;
};

/**
 * Adds padding to a time value so
 * that it is always 2 digits.
 */
export const addTimePadding = (value: number): string => {
  const valueToString = value.toString();
  if (valueToString.length > 1) {
    return valueToString;
  }

  return `0${valueToString}`;
};

/**
 * Formats the hour value so that it
 * is always 2 digits. Only applies
 * if using 12 hour format.
 */
export const getFormattedHour = (hour: number, use24Hour: boolean): string => {
  if (!use24Hour) {
    return hour.toString();
  }

  return addTimePadding(hour);
};

/**
 * Generates an aria-label to be read by screen readers
 * given a local, a date, and whether or not that date is
 * today's date.
 */
export const generateDayAriaLabel = (locale: string, today: boolean, refParts: DatetimeParts) => {
  if (refParts.day === null) {
    return null;
  }

  /**
   * MM/DD/YYYY will return midnight in the user's timezone.
   */
  const date = new Date(`${refParts.month}/${refParts.day}/${refParts.year} GMT+0000`);

  const labelString = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);

  /**
   * If date is today, prepend "Today" so screen readers indicate
   * that the date is today.
   */
  return today ? `Today, ${labelString}` : labelString;
};

/**
 * Gets the day of the week, month, and day
 * Used for the header in MD mode.
 */
export const getMonthAndDay = (locale: string, refParts: DatetimeParts) => {
  const date = new Date(`${refParts.month}/${refParts.day}/${refParts.year} GMT+0000`);
  return new Intl.DateTimeFormat(locale, { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' }).format(
    date
  );
};

/**
 * Given a locale and a date object,
 * return a formatted string that includes
 * the month name and full year.
 * Example: May 2021
 */
export const getMonthAndYear = (locale: string, refParts: DatetimeParts) => {
  const date = new Date(`${refParts.month}/${refParts.day}/${refParts.year} GMT+0000`);
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
};
