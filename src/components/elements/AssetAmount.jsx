import React from "react";
import PropTypes from 'prop-types';
import {ChainStore} from "peerplaysjs-lib";
import BigNumber from "bignumber.js";


class AssetAmount extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			asset: null
		};
	}
	
	componentDidMount() {
		ChainStore.FetchChain('getAsset', this.props.asset_id).then(asset => {
			this.setState({asset});
		});
	}
	
	render() {
		let {asset} = this.state;
		let {amount} = this.props;
		if(!asset)
			return null;
		return new BigNumber(amount).div(Math.pow(10, 9)).toNumber().toFixed(2);
	}
	
}

AssetAmount.propTypes = {
	asset_id: PropTypes.string.isRequired,
	amount: PropTypes.number.isRequired
};

export default AssetAmount;