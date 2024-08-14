export interface ITableViewProps {
  data: object[];
  columns?: string[];
  isLoading: boolean;
}

export const TableView = ({ data, columns, isLoading }: ITableViewProps): JSX.Element => {
  const headers = (): JSX.Element => {
    const columnNames = columns ?? Object.keys(data[0]);
    return (
      <tr>
        {columnNames.map((col, i) => (
          <td key={i}>{col}</td>
        ))}
      </tr>
    );
  };

  const rows = (): JSX.Element[] => {
    const columnNames = columns ?? Object.keys(data[0]);
    return data.map((element, i) => (
      <tr key={i}>
        {columnNames.map((col, i) => {
          return <td key={i}>{element[col]}</td>;
        })}
      </tr>
    ));
  };

  if (isLoading === true) {
    return <> LOADING... </>;
  }

  if (data === undefined || data.length == 0) {
    return <>NO RESULTS</>;
  }

  return (
    <table className="table-body">
      <thead>{headers()}</thead>
      <tbody>{rows()}</tbody>
    </table>
  );
};
