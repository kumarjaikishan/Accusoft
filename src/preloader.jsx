const Preloader = () => {
  return (
    <div className='preloder'>
      <div class='u-positionAbsolute'>
        <div class='SlackLoader'>
          <div class='SlackLoader-item'>
            <div class='SlackLoader-dot'></div>
          </div>
          <div class='SlackLoader-item'>
            <div class='SlackLoader-dot'></div>
          </div>
          <div class='SlackLoader-item'>
            <div class='SlackLoader-dot'></div>
          </div>
          <div class='SlackLoader-item'>
            <div class='SlackLoader-dot'></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
