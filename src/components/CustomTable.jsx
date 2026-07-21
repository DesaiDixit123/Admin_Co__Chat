import { Paginator } from "primereact/paginator";

const CustomTable = ({ columns, data, isPagination, totalRecords, handlePageChange, pagination, }) => {
  const { page, limit } = pagination || { page: 1, limit: 10 };

  const onPageChange = (event) => {
    const newPage = event.page + 1; // PrimeReact is 0-based
    const newLimit = event.rows;

    handlePageChange(newPage, newLimit);
  };
  return (
    <>
      <div className="w-full mb-6 xs:mb-12 xl:mb-0 mx-auto mt-3.5 lg:mt-5 2xl:mt-7 overflow-x-auto custom_table">
        <table className="w-full border-collapse border border-l3">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.length > 0 ?
              data?.map((row, index) => (
                <tr key={index}>{columns.map((column) => (
                  <td key={column.key}>{column.renderCell ? column.renderCell(row[column.key], row) : row[column.key]}</td>
                ))}</tr>
              ))
              : <tr>
                <td colSpan={columns.length}>
                  <div className="w-full bg-white">
                    <div className="w-full flex justify-center p-5 ">
                      <div className="max-w-8xl w-full rounded-2xl p-10 mx-auto bg-gray_2">
                        <strong className="block text-20 lg:text-24 text-center">No Data Available</strong>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      {isPagination && data?.length > 0 && (
        <div className="border-t border-b3 mt-auto">
          <div className="justify-center items-center flex paginator_custom">
            <Paginator
              className="mx-auto xs:mx-0 bg-transparent"
              first={(page - 1) * limit}
              rows={limit}
              totalRecords={totalRecords}
              rowsPerPageOptions={[10, 20, 50]}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      )}

    </>
  )
}

export default CustomTable