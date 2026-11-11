export function handleA11y1000FirstNumbers(val: number) {
  const tensDefinition = Number(val.toString().substring(1, 3));
  const tens = tensDefinition ? `and ${tensDefinition}` : '';
  const exactTens = [
    '10',
    '20',
    '30',
    '40',
    '50',
    '60',
    '70',
    '80',
    '90',
  ].includes(tens);

  if (val >= 100 && val < 1000) {
    return `${val.toString().substring(0, 1)} hundred ${
      exactTens ? `and ${tens}` : tens
    }`;
  }
  if (val === 1000) {
    return 'one thousand';
  }
  if (val < 100) {
    return val;
  }
}
