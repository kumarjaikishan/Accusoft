const Preloader = () => {
  return (
    <div className='preloder'>
      <div className='u-positionAbsolute'>
        <div className='SlackLoader'>
          <div className='SlackLoader-item'>
            <div className='SlackLoader-dot'></div>
          </div>
          <div className='SlackLoader-item'>
            <div className='SlackLoader-dot'></div>
          </div>
          <div className='SlackLoader-item'>
            <div className='SlackLoader-dot'></div>
          </div>
          <div className='SlackLoader-item'>
            <div className='SlackLoader-dot'></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
