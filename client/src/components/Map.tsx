export const Map = () => {
    return (
        <div style={{alignItems: 'center'}}>
            <div style={{whiteSpace: 'nowrap', textAlign: 'center', width: '2000px', height: '2000', padding: '100px'}}>
                <iframe width="1000" height="800"
                        src="https://www.bing.com/maps/embed?h=400&w=500&cp=32.06692659097088~34.78262995523687&lvl=10.950990165584006&typ=d&sty=r&src=SHELL&FORM=MBEDV8"
                        scrolling="no" style={{display: 'block', borderStyle: 'none' ,margin:'0 auto', width:'1000', height: '500'}}>
                </iframe>
                <a id="largeMapLink" target="_blank"
                   href="https://www.bing.com/maps?cp=32.06692659097088~34.78262995523687&amp;sty=r&amp;lvl=10.950990165584006&amp;FORM=MBEDLD">View
                    Larger Map</a> &nbsp; | &nbsp;
                <a id="dirMapLink" target="_blank"
                   href="https://www.bing.com/maps/directions?cp=32.06692659097088~34.78262995523687&amp;sty=r&amp;lvl=10.950990165584006&amp;rtp=~pos.32.06692659097088_34.78262995523687____&amp;FORM=MBEDLD">Get
                    Directions</a>
            </div>
        </div>
    )
}