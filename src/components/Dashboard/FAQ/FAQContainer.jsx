import React, { Component } from 'react';
import { connect } from 'react-redux';
import LandingHeader from '../../Landing/LandingHeader.jsx';
import Header from '../../Header/Header';
import '../../../../assets/scss/faq.scss';

class FAQContainer extends Component {
    render() {

        let header = <LandingHeader />;

        if (this.props.isLogin) {
            header = <Header />;
        }

        return (
        <div>{header}
          <div className="body-faq">
            <section className="section">
			<div className="inner-wrapper">
				<h3 className="header-faq">Frequently Asked Questions</h3>
				<ol className="panel">
					<li><a href="">Question 1, Lorem Ipsum is simply 
					dummy text of the printing and typesetting industry. </a>
					</li>
					<li><a href="">Question 2, Lorem Ipsum is simply 
					dummy text of the printing and typesetting industry. </a>
					</li>
					<li><a href="">Question 3, Lorem Ipsum is simply 
					dummy text of the printing and typesetting industry. </a>
					</li>
					<li><a href="">Question 4, Lorem Ipsum is simply 
					dummy text of the printing and typesetting industry. </a>
					</li>
					<li><a href="">Question 5, Lorem Ipsum is simply 
					dummy text of the printing and typesetting industry. </a>
					</li>
					<li><a href="">Question 6, Lorem Ipsum is simply 
					dummy text of the printing and typesetting industry. </a>
					</li>
					<li><a href="">Question 7, Lorem Ipsum is simply 
					dummy text of the printing and typesetting industry. </a>
					</li>
					<li><a href="_">Question 8, Lorem Ipsum is simply 
					dummy text of the printing and typesetting industry. </a>
					</li>
					<li><a href="">Question 9, Lorem Ipsum is simply 
					dummy text of the printing and typesetting industry.</a></li>
				</ol>
				<h4><a name="Answer_1:_">Answer 1: </a></h4>
				<p>Lorem Ipsum is simply dummy text of the printing and 
				typesetting industry. Lorem Ipsum has been the industry's 
				standard dummy text ever since the 1500s, when an unknown 
				printer took a galley of type and scrambled it to make a type 
				specimen book. It has survived not only five centuries.</p>
				<h4><a name="Answer_2:_">Answer 2: </a></h4>
				<p>Lorem Ipsum is simply dummy text of the printing and 
				typesetting industry. Lorem Ipsum has been the industry's 
				standard dummy text ever since the 1500s, when an unknown 
				printer took a galley of type and scrambled it to make a type 
				specimen book. It has survived not only five centuries.</p>
				<h4><a name="Answer_3:_">Answer 3: </a></h4>
				<p>Lorem Ipsum is simply dummy text of the printing and 
				typesetting industry. Lorem Ipsum has been the industry's 
				standard dummy text ever since the 1500s, when an unknown 
				printer took a galley of type and scrambled it to make a type 
				specimen book. It has survived not only five centuries.</p>
				<h4><a name="Answer_4:_">Answer 4: </a></h4>
				<p>Lorem Ipsum is simply dummy text of the printing and 
				typesetting industry. Lorem Ipsum has been the industry's 
				standard dummy text ever since the 1500s, when an unknown 
				printer took a galley of type and scrambled it to make a type 
				specimen book. It has survived not only five centuries.</p>
				<h4><a name="Answer_5:_">Answer 5: </a></h4>
				<p>Lorem Ipsum is simply dummy text of the printing and 
				typesetting industry. Lorem Ipsum has been the industry's 
				standard dummy text ever since the 1500s, when an unknown 
				printer took a galley of type and scrambled it to make a type 
				specimen book. It has survived not only five centuries.</p>
				<h4><a name="Answer_6:_">Answer 6: </a></h4>
				<p>Lorem Ipsum is simply dummy text of the printing and 
				typesetting industry. Lorem Ipsum has been the industry's 
				standard dummy text ever since the 1500s, when an unknown 
				printer took a galley of type and scrambled it to make a type 
				specimen book. It has survived not only five centuries.</p>
				<h4><a name="Answer_7:_">Answer 7: </a></h4>
				<p>Lorem Ipsum is simply dummy text of the printing and 
				typesetting industry. Lorem Ipsum has been the industry's 
				standard dummy text ever since the 1500s, when an unknown 
				printer took a galley of type and scrambled it to make a type 
				specimen book. It has survived not only five centuries.</p>
				<h4><a name="Answer_8:_">Answer 8: </a></h4>
				<p>Lorem Ipsum is simply dummy text of the printing and 
				typesetting industry. Lorem Ipsum has been the industry's 
				standard dummy text ever since the 1500s, when an unknown 
				printer took a galley of type and scrambled it to make a type 
				specimen book. It has survived not only five centuries.</p>
				<h4><a name="Answer_9:_">Answer 9: </a></h4>
				<p>Lorem Ipsum is simply dummy text of the printing and 
				typesetting industry. Lorem Ipsum has been the industry's 
				standard dummy text ever since the 1500s, when an unknown 
				printer took a galley of type and scrambled it to make a type 
				specimen book. It has survived not only five centuries.</p>
			</div>
		</section>
          </div>
          </div>
                
        );
    }
}

const mapStateToProps = state => ({
    isLogin: state.app.isLogin
});

const mapDispatchToProps = dispatch => ({ // Placeholder for now

});

export default connect(mapStateToProps, mapDispatchToProps)(FAQContainer);
