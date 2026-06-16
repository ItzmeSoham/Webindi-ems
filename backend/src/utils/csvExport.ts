interface CsvColumn {
  id: string;
  title: string;
}

export const generateCSV = (data: Record<string, any>[], columns: CsvColumn[]): string => {
  const header = columns.map((col) => `"${col.title}"`).join(',');
  const rows = data.map((row) =>
    columns
      .map((col) => {
        const value = row[col.id];
        if (value === null || value === undefined) return '""';
        const strValue = String(value).replace(/"/g, '""');
        return `"${strValue}"`;
      })
      .join(',')
  );
  return [header, ...rows].join('\n');
};
