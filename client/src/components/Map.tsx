export const Map = () => {
    return (
        <div className="BingMap">
            <div>
                <iframe width="1000" height="800"
                        src="https://www.bing.com/maps/embed?h=800&w=1000&cp=32.06692659097088~34.78262995523687&lvl=10.950990165584006&typ=d&sty=r&src=SHELL&FORM=MBEDV8"
                        scrolling="no" style={{display: 'block', borderStyle: 'none' ,margin:'0 auto', width:'1000', height: '500'}}>
                </iframe>
            </div>
        </div>
    )
}