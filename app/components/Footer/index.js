import React from 'react';

class Footer extends React.Component {
  render() {
    return (
      <div>
      <div className="footer slds-m-horizontal--large slds-m-top--xx-large">
        <div>
          <h2>Version Notes</h2>
          <p>Version 1.0: This catalogue provides access to the LOFAR database and allows for processing the LOFAR data directly from the catalog.</p>
        </div>
        <div className="flex-container">
          <div className="flex-item">
            <a href="https://www.esciencecenter.nl/">
            <img src="pics/EU_flag_yellow_.jpg" alt="" className="img-responsive" />
            </a>
          </div>
          <div className="flex-item">
            <a href="https://www.esciencecenter.nl/">
            <img src="pics/lmu-logo-neg-green.gif" alt="" className="img-responsive" />
            </a>
          </div>
          <div className="flex-item">
            <a href="http://www.lofar.org">
            <img src="pics/logo-uva.png" alt="" className="img-responsive"/>
            </a>
          </div>
          <div className="flex-item">
            <a href="http://cordis.europa.eu/project/rcn/191235_en.html">
            <img src="pics/nlesc-logo.gif" alt="" className="img-responsive" />
            </a>
          </div>
          <div className="flex-item">
            <a href="http://cordis.europa.eu/project/rcn/191235_en.html">
            <img src="pics/HesSO.gif" alt="" className="img-responsive" />
            </a>
          </div>
          <div className="flex-item">
            <a href="https://www.astron.nl/">
            <img src="pics/LSY.gif" alt=""className="img-responsive" />
            </a>
          </div>
            <div className="flex-item">
            <a href="https://www.astron.nl/">
            <img src="pics/INMARK-europa.gif" alt=""className="img-responsive" />
            </a>
          </div>
          <div className="flex-item">
            <a href="https://www.astron.nl/">
            <img src="pics/uisav_logo.png" alt=""className="img-responsive" />
            </a>
          </div>
          <div className="flex-item">
            <a href="https://www.astron.nl/">
            <img src="pics/cyfronet_logo_monochr.png" alt=""className="img-responsive" />
            </a>
          </div>
          <br/>
        </div>
      </div>
      <div className="page-footer" role="banner">
        <div className="slds-grid  slds-grid--vertical-align-center">
          <p>This project received funding from the Netherlands eScience Center under grant AA-ALERT (027.015.G09), and from the European Research Council under the European Union's Seventh Framework Programme (FP/2007-2013) / ERC Grant Agreement n. 617199.</p>
        </div>
      </div>
      </div>
        );
    }
};

export default Footer;
