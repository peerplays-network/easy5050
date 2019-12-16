import React, { Component } from 'react';
import '../../../assets/scss/footer.css';
import logo from '../../../assets/images/powerbypp.png';


class Footer extends Component {

    render() {
        return (
            <footer>
                <div className="footer">

                    <div className="centered-footer">

                      <p>Peerplays is the first decentralized global betting platform, disrupting the global gaming industry with a new paradigm of fairness, transparency, speed, and security. <br />
    Peerplays removes the need for third-party betting operators, using Graphene technology and Gamified Proof of Stake (GPoS) to provide the fastest, most decentralized blockchain consensus model available today.</p>

                      <p> 47 Lockheed Crescent, Debert, NS, B0M 1G0, Tel: 1-902-707-0277 </p> <a className="socialIcon-footer" href="https://www.peerplays.com/" target="_blank">https://www.peerplays.com/</a>

                      <div className="icons-footer">
                          <a href="https://www.facebook.com/PeerPlays/"> <i className="fab fa-facebook fa-2x socialIcon-footer" /></a>
                          <a href="https://twitter.com/Peerplays"> <i className="fab fa-twitter fa-2x socialIcon-footer" /></a>
                          <a href="https://www.linkedin.com/company/peerplays-blockchain/"> <i className="fab fa-linkedin fa-2x socialIcon-footer" /></a>
                          <a href="https://medium.com/@PeerplaysNetwork/"> <i className="fab fa-medium fa-2x socialIcon-footer" /></a>
                          <a href="https://www.reddit.com/r/Peerplays/"> <i className="fab fa-reddit fa-2x socialIcon-footer" /></a>
                          <a href="https://www.youtube.com/channel/UC3LeI-oL5jTa5UAN7hF-xFQ"> <i className="fab fa-youtube fa-2x socialIcon-footer" /></a>
                        </div>
                      <br />
                      <img src={logo} />
                    </div>
                  </div>
                      </footer>
        );
    }
}

export default Footer;
