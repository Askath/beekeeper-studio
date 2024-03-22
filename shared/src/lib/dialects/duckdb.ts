import {
  ColumnType,
  defaultConstraintActions,
  defaultEscapeString,
  DialectData,
  SpecialTypes,
} from "./models";

const types = [
  ...SpecialTypes,
  'int', 'int2', 'int8', 'integer', 'tinyint', 'smallint', 'mediumint', 'bigint', 'decimal', 'numeric', 'float', 'double', 'real', 'double precision', 'datetime', 'varying character', 'character', 'native character', 'varchar', 'nchar', 'nvarchar2', 'unsigned big int', 'boolean', 'blob', 'text', 'clob', 'date'
]

const supportsLength = [
  'char', 'varchar'
]

const defaultLength = (t: string) => t.startsWith('var') ? 255 : 8

const UNWRAPPER = /^(?:`(.*)`|'(.*)'|"(.*)")$/

export const DuckDBData: DialectData = {
  columnTypes: types.map((t) => new ColumnType(t, supportsLength.includes(t), defaultLength(t))),
  constraintActions: [...defaultConstraintActions, 'RESTRICT'],
  escapeString: defaultEscapeString,
  wrapLiteral: (value: string) => (value !== "*") ? `'${value.replaceAll(/'/g, "''")}'` : "*",
  wrapIdentifier: (value: string) => (value !== "*") ? `"${value.replaceAll(/"/g, '""')}"` : "*",
  usesOffsetPagination: true,
  requireDataset: false,
  editorFriendlyIdentifier: (s) => s,
  unwrapIdentifier(value: string) {
    const matched = value.match(UNWRAPPER);
    if (matched) return matched[1] || matched[2] || matched[3];
    return value;
  },
  disabledFeatures: {
    triggers: false,
  },
  notices: {
    infoTriggers: "Note: DuckDB does not support triggers",
  },
}