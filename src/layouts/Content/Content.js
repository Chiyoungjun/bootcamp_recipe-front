import './Content.css';

const Content = ({
    children,

    paddingTop,
    paddingBottom,
    paddingRight,
    paddingLeft,

    gap,
}) => {
    return (
        <div
            className='content-container'
            style={{
                paddingTop: `${paddingTop}px`,
                paddingBottom: `${paddingBottom}px`,
                paddingRight: `${paddingRight}px`,
                paddingLeft: `${paddingLeft}px`,
                gap: `${gap}px`
            }}
        >
            {children}
        </div>
    );
};

export default Content;