import React from 'react';
import './sidebar.css';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { header } from '../../store/login';
import { useSelector, useDispatch } from 'react-redux';
import { MdOutlineGrass } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdKeyboardArrowUp } from "react-icons/md";
import { FaLock } from "react-icons/fa6";
import { FaTachometerAlt } from "react-icons/fa";
import { CiUser } from "react-icons/ci";
import { FaShippingFast } from "react-icons/fa";
import { PiHourglassLowFill } from "react-icons/pi";
import { FaSignOutAlt } from "react-icons/fa";
import { MdOutlineAttachMoney } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { FaServer,FaBook } from "react-icons/fa6";
import { BsBank2 } from "react-icons/bs";
import { TbReportAnalytics } from "react-icons/tb";

const Sidebar = () => {
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const log = useSelector((state) => state.login);
    const useralldetail = useSelector((state) => state.userexplist);

    const [adminSubMenuVisible, setAdminSubMenuVisible] = React.useState(false);
    const [testSubMenuVisible, settestSubMenuVisible] = React.useState(false);

    const toggleAdminSubMenu = () => {
        setAdminSubMenuVisible(!adminSubMenuVisible);
    };
    const toggletestSubMenu = () => {
        settestSubMenuVisible(!testSubMenuVisible);
    };

    const linke = [
        {
            name: 'Dashboard',
            link: '/',
            logo: <FaTachometerAlt title='Dashboard' />,
        },
        {
            name: 'Expenses',
            link: '/addexpense',
            logo: <BsBank2 title='Expense' />,
        },
        {
            name: 'Exp. Analysis',
            link: '/datanalysis',
            logo: <FaBook title='Exp. Analysis' />,
        },
        {
            name: 'Report',
            link: '/report',
            logo: <TbReportAnalytics title='Report' />,
        },
        // {
        //     name: 'Print',
        //     link: '/print',
        //     logo: 'fa fa-print',
        // },
    ];

    const fr = () => {
        swal({
            title: 'Are you sure to Logout?',
            text: '',
            icon: 'warning',
            buttons: true,
            dangerMode: true,
        }).then(async (willDelete) => {
            if (willDelete) {
                dispatch(header('Login'));
                toast.success('Logout successful', { autoClose: 1300 });
                navigate('/logout');
            }
        });
    };

    return (
        <>
            <div className={log.narrow ? 'sidebar narrow' : 'sidebar'}>
                <div className="clogo">
                    <NavLink
                        className={(navData) => (navData.isActive ? 'active' : '')}
                        style={{ textDecoration: 'none' }}
                        to="/"
                    >
                        <span className="li">
                            <span className="logo">
                                <MdOutlineGrass className="company" />
                            </span>
                            <span className="name">Accusoft</span>
                        </span>
                    </NavLink>
                </div>
                <div className="link">
                    {log.islogin
                        ? linke.map((val, ind) => {
                            return (
                                <NavLink
                                    key={ind}
                                    className={(navData) => (navData.isActive ? 'active' : '')}
                                    style={{ textDecoration: 'none' }}
                                    to={val.link}
                                >
                                    <span className="li aur" onClick={() => dispatch(header(val.name))}>
                                        <span className="logo">
                                            {val.logo}
                                        </span>
                                        <span className="name">{val.name}</span>
                                    </span>
                                </NavLink>
                            );
                        })
                        : null}
                    {log.islogin ? useralldetail?.user?.isadmin ? (
                        <div className="admin-panel">
                            <span className={`li ${adminSubMenuVisible ? 'active' : ''}`} onClick={toggleAdminSubMenu} >
                                <span className="logo">
                                    <FaLock title='Admin' />
                                </span>
                                <span className="name">Admin</span>
                                {!log.narrow && <span> {adminSubMenuVisible ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}</span>}
                            </span>
                            {adminSubMenuVisible && (
                                <div className="sub-menu">
                                    <NavLink
                                        className={(navData) => (navData.isActive ? 'active' : '')}
                                        style={{ textDecoration: 'none' }}
                                        to="/admin/dashboard"
                                    >
                                        <span className="li undersubmenu" onClick={() => dispatch(header('Admin/ Dashboard'))}>
                                            <span className="logo">
                                                <FaTachometerAlt title='User' />
                                            </span>
                                            <span className="name">Dashboard</span>
                                        </span>
                                    </NavLink>
                                    <NavLink
                                        className={(navData) => (navData.isActive ? 'active' : '')}
                                        style={{ textDecoration: 'none' }}
                                        to="/admin/users"
                                    >
                                        <span className="li undersubmenu" onClick={() => dispatch(header('Admin/ Users'))}>
                                            <span className="logo">
                                                <CiUser title='User' />
                                            </span>
                                            <span className="name">Users</span>
                                        </span>
                                    </NavLink>
                                    <NavLink
                                        className={(navData) => (navData.isActive ? 'active' : '')}
                                        style={{ textDecoration: 'none' }}
                                        to="/admin/tip"
                                    >
                                        <span className="li undersubmenu" onClick={() => dispatch(header('Slow Page'))}>
                                            <span className="logo"> <MdOutlineAttachMoney />   </span>
                                            <span className="name">StreamElement</span>
                                        </span>
                                    </NavLink>
                                    <NavLink
                                        className={(navData) => (navData.isActive ? 'active' : '')}
                                        style={{ textDecoration: 'none' }}
                                        to="/admin/filehandle"
                                    >
                                        <span className="li undersubmenu" onClick={() => dispatch(header('Admin/ File Handle'))}>
                                            <span className="logo">
                                                <CiUser title='User' />
                                            </span>
                                            <span className="name">File handle</span>
                                        </span>
                                    </NavLink>
                                </div>
                            )}
                        </div>
                    ) : null : null}
                    {log.islogin ? useralldetail.user?.isadmin ? (
                        <div className="admin-panel">
                            <span className={`li ${testSubMenuVisible ? 'active' : ''}`} onClick={toggletestSubMenu} >
                                <span className="logo">
                                    <FaServer title='Server' />
                                </span>
                                <span className="name">Server Test</span>
                                {!log.narrow && <span> {testSubMenuVisible ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}</span>}    </span>
                            {testSubMenuVisible && (
                                <div className="sub-menu">
                                    <NavLink
                                        className={(navData) => (navData.isActive ? 'active' : '')}
                                        style={{ textDecoration: 'none' }}
                                        to="/slow"
                                    >
                                        <span className="li undersubmenu" onClick={() => dispatch(header('Slow Page'))}>
                                            <span className="logo"> <PiHourglassLowFill />   </span>
                                            <span className="name">Server Slow</span>
                                        </span>
                                    </NavLink>

                                    <NavLink
                                        className={(navData) => (navData.isActive ? 'active' : '')}
                                        style={{ textDecoration: 'none' }}
                                        to="/slowworker"
                                    >
                                        <span className="li undersubmenu" onClick={() => dispatch(header('Slow Worker'))}>
                                            <span className="logo">
                                                <FaShippingFast title='worker thread' />
                                            </span>
                                            <span className="name">Worker Fast</span>
                                        </span>
                                    </NavLink>

                                </div>
                            )}
                        </div>
                    ) : null : null}
                    {log.islogin ? (
                        <span className="li" onClick={fr}>
                            <span className="logo">
                                <FaSignOutAlt title='Sign Out' />
                            </span>
                            <span className="name">Logout</span>
                        </span>
                    ) : (
                        <NavLink
                            className={(navData) => (navData.isActive ? 'active' : '')}
                            style={{ textDecoration: 'none' }}
                            to="/login"
                        >
                            <span className="li" onClick={() => dispatch(header('Login'))}>
                                <span className="logo">
                                    <FaRegUser title='Sign In' />
                                </span>
                                <span className="name">Login</span>
                            </span>
                        </NavLink>
                    )}
                </div>
            </div>
        </>
    );
};

export default Sidebar;
