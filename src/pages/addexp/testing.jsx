import DataTable from 'react-data-table-component';
import { useEffect, useState } from 'react';

const AddExpenses = () => {

    const [allexp, setallexp] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    useEffect(() => {
        fetchData(1, 20);
    }, [])

    useEffect(() => {

    }, [])


    const columns = [
        {
            name: 'Ledger',
            selector: row => row.ledger?.ledger || '-',
            sortable: true,
        },
        {
            name: 'Amount',
            selector: row => row.amount,
            sortable: true,
        }
    ]

    const fetchData = async (page, size = perPage) => {
        console.log(`fetch called from page:${page} & size:${size}`);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${import.meta.env.VITE_API_ADDRESS}explist?page=${page}&limit=${size}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            const result = await res.json();
            const startIndex = (page - 1) * size;

            if (page === 1 && result.total) {
                setallexp(new Array(result.total).fill({ _placeholder: true }));

            }

            setallexp((prev) => {
                const updated = [...prev];
                for (let i = 0; i < result.items.length; i++) {
                    updated[startIndex + i] = result.items[i];
                }
                console.log(updated)
                return updated;
            });

            setTotalRows(result.total);
        } catch (error) {
            console.error(error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        const startIndex = (page - 1) * perPage;
        const pageData = allexp.slice(startIndex, startIndex + perPage);
        console.log(pageData)
        const isPageDataMissing = pageData.some(item => !item || item._placeholder);

        if (isPageDataMissing) {
            fetchData(page, 50);
        }
    };

    const handlePerRowsChange = (newPerPage, page) => {
        setPerPage(newPerPage);
        setCurrentPage(page);
        fetchData(page, newPerPage);
    };

    return (
        <div>
            <DataTable
                columns={columns}
                data={allexp}
                pagination
                // paginationServer
                paginationTotalRows={totalRows}
                paginationPerPage={perPage}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
                highlightOnHover
            />
        </div>
    )
}

export default AddExpenses
