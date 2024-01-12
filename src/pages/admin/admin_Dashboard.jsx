import './admin_Dashboard.css';

const Admin_Dashboard = () => {
    return (
        <>
            <div className="admindashboard">
                <div className="card"  >
                    <div className="data">
                        <div className="amt"> 4</div>
                        <div className="day">Total Users</div>
                    </div>
                    <div className="icon" style={{ color: "white" }}><i class="fa fa-users" aria-hidden="true"></i></div>
                </div>
                <div className="card"  >
                    <div className="data">
                        <div className="amt"> 5600</div>
                        <div className="day">Total Expense Record</div>
                    </div>
                    <div className="icon" style={{ color: "white" }}><i className="fa fa-balance-scale" aria-hidden="true"></i></div>
                </div>
            </div>
        </>
    )
}

export default Admin_Dashboard;