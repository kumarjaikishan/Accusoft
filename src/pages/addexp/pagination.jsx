import { useState } from 'react'
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

const Pagination = ({ totalpost, postperpage, changepageno, currentpage }) => {
  let pages = [];
  const [pagenumberlimit, setpagenumberlimit] = useState(5);
  const [maxpagenumberlimit, setmaxpagenumberlimit] = useState(5);
  const [minpagenumberlimit, setminpagenumberlimit] = useState(0);

  for (let i = 1; i <= Math.ceil(totalpost / postperpage); i++) {
    pages.push(i);
  }

  const renderpagination = pages.map((val, ind) => {

    if (val < maxpagenumberlimit + 1 && val > minpagenumberlimit) {
      return (
        <span key={ind} onClick={() => changepageno(val)} className={currentpage == val ? "pages active" : "pages"}>{val}</span>
      )
    }

    // if (val >= (currentpage-2) && val <= (currentpage+2)) {
    //   return (
    //     <span key={ind} onClick={() => changepageno(val)} className={currentpage == val ? "pages active" : "pages"}>{val}</span>
    //   )
    // }
  })

  const plus = () => {
    setmaxpagenumberlimit(maxpagenumberlimit + pagenumberlimit)
    setminpagenumberlimit(minpagenumberlimit + pagenumberlimit)
    if (maxpagenumberlimit >= pages.length - 1) {
      setmaxpagenumberlimit(pages.length);
      setminpagenumberlimit(pages.length - pagenumberlimit)
    }
  }

  const minus = () => {
    setmaxpagenumberlimit(maxpagenumberlimit - pagenumberlimit)
    setminpagenumberlimit(minpagenumberlimit - pagenumberlimit)
    if (minpagenumberlimit <= 1) {
      setmaxpagenumberlimit(pagenumberlimit);
      setminpagenumberlimit(0)
    }
  }
  // console.log(currentpage);
  return (
    <>
      <MdKeyboardDoubleArrowLeft title='Previous 5 Pages' onClick={minus} />
      {
        renderpagination
      }
      <MdKeyboardDoubleArrowRight title='Next 5 Pages' onClick={plus} />
    </>
  )
}

export default Pagination;