import React from "react";
import PropTypes from 'prop-types';
import $ from 'jquery';
import Helper from "../Dashboard/Draws/Helper";



class NumberRoller extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			domid: Math.floor(Math.random() * 1000000000) + ""
		};
	}
    
   

    

	startRoll() {
        let me = this;
        let digitMarginMap = new Map([["1.10", "0.9786324786324786"], ["1.25", "0.982905982905983"], ["1.50","0.9914529914529915"],["1.75","0.9957264957264957"]]);
        let marginMultiplier = digitMarginMap.get(window.devicePixelRatio.toFixed(2).toString())
        setTimeout(function(){ 
            let {number} = me.props;
            number = number + "";
            if(number.lastIndexOf(".")  != -1 && number.length - number.lastIndexOf(".") - 1 > 9){
                number = number.substr(0,number.lastIndexOf(".") + 10);
            }
            let nArray = number.split("");
            var div = $('#number-roller' + me.state.domid);
            // var div = $('#number-roller');
            //console.log("cwrp: " + me.state.domid + " #" + number);
            var digits = (number + "").split("").reverse();  
            var digitsOnScreen = nArray.length;
            
            //$(div).find('.digit').css('transition', 'ease-out 0s');
            //$(div).find('.digit').css('marginTop', 0);
            setTimeout(function(){
                $(div).find('.digit').css('transition', 'ease-out 4s');
                var lineHeight = parseInt($(div).css('lineHeight'));
                $(digits).each(function(i, d) {
                    if(d!="."){
                        var digit = $(div).find('.digit')[digitsOnScreen - i - 1];
                        var el = $(digit).find('div')[parseInt(d)];

                        if(me.props.usingChrome === false || marginMultiplier === undefined) {
                            $(digit).css('marginTop', lineHeight * -1 * d);
                        }
                        else {
                            $(digit).css('marginTop', Math.round(lineHeight * -1 * d*marginMultiplier*2)/2);
                        }
                    }
                
                
                }); 
            }, 250); 
            
        }, 250);   
        
	}
	
	render() {
        let {number, showCurrency} = this.props;
        number = number + "";

        if(number.lastIndexOf(".")  != -1 && number.length - number.lastIndexOf(".") - 1 > 9){
            number = number.substr(0,number.lastIndexOf(".") + 10);
        }
        if(this.props.visible === false)
            number = 0+"";
        let nArray = number.split("");
        let digitsOnScreen = nArray.length;
        //console.log("rend: " + this.state.domid + " #" + number);
        let me = this;
        setTimeout(function(){ 
            me.startRoll();
        },250);
        return(
            <div>
                
                <div id={"number-roller" + this.state.domid} className="number-roller" 
                style={{
                    fontSize: this.props.fontSize,
                    fontFamily: this.props.useFont,
                    lineHeight: this.props.lineHeight
                }}>
                
                

                {
                    nArray.map(num => 


                        
                        // num == "." ?
                        //     <div className="digit-decimal">
                        //         <div>.</div>
                        //     </div>
                        // :
                            <div className="digit" style={{color: this.props.fontColor}}>
                                {num == "." ? <div >.</div> : ""}
                                <div
                                    className = {num == 1 ? "top" : num == "." ? "bottom" : ''}
                                    
                                >0</div>
                                <div
                                    className = {num == 2 ? "top" : num == 0 ? "bottom" : ''}
                                    
                                >1</div>
                                <div
                                    className = {num == 3 ? "top" : num == 1 ? "bottom" : ''}
                                    
                                >2</div>
                                <div
                                    className = {num == 4 ? "top" : num == 2 ? "bottom" : ''}
                                    
                                >3</div>
                                <div
                                    className = {num == 5 ? "top" : num == 3 ? "bottom" : ''}
                                    
                                >4</div>
                                <div
                                    className = {num == 6 ? "top" : num == 4 ? "bottom" : ''}
                                    
                                >5</div>
                                <div
                                    className = {num == 7 ? "top" : num == 5 ? "bottom" : ''}
                                    
                                >6</div>
                                <div
                                    className = {num == 8 ? "top" : num == 6 ? "bottom" : ''}
                                    
                                >7</div>
                                <div
                                    className = {num == 9 ? "top" : num == 7 ? "bottom" : ''}
                                    
                                >8</div>
                                <div
                                    className = {num == 8 ? "bottom" : ''}
                                    
                                >9</div>
                            </div>
                        
                    )
                }
                
                 <div className="yellow-landing" style={
                     { 'marginLeft': ((digitsOnScreen * .05 + 1) + "em"),
                        'width': ((digitsOnScreen * 4 + 4) + "%") }
                     }>{showCurrency ?  (Helper.getUnits().constructor === String ? Helper.getUnits() : "") : ""}</div>
                <div className="foreground"></div>
                </div>
            </div>
        );
		
	}
	
}

NumberRoller.propTypes = {
    number: PropTypes.number.isRequired,
    showCurrency: PropTypes.bool,
    useFont: PropTypes.string,
    fontSize: PropTypes.string,
    fontColor: PropTypes.string,
    lineHeight: PropTypes.string
};

NumberRoller.defaultProps = {
    useFont: "AGENCYR",
    fontSize: "26px",
    fontColor: "white",
    lineHeight: "1.5em",
    showCurrency: true
};

export default NumberRoller;