import React from "react";
import PropTypes from 'prop-types';
import {ChainStore} from "peerplaysjs-lib";
import BigNumber from "bignumber.js";


class AssetName extends React.Component {
	
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
		if(!asset)
			return null;
		return asset.get('symbol');
	}
	
}

AssetName.propTypes = {
	asset_id: PropTypes.string.isRequired
};

export default AssetName;