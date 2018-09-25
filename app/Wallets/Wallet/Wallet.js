import React from 'react';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import { has, equals } from 'ramda';
import wrapedWallet from '../../CommonComponents/Chart';
import * as actions from './Actions';
import Operations from './OperationSelector';
import Transactions from './Transactions';
import WalletInfo from './WalletInfo';
import { Tokens } from './Tokens';
import Modal from '../../CommonComponents/Modal';
import {
  Content,
  LeftColumnContainer,
  MiddleColumnContainer,
  RightColumnContainer,
} from '../../Views';

class Wallet extends React.Component {
  constructor(props) {
    super(props);
    if (props.wallet.wid !== props.match.params.id) {
      props.getWalletInGaia(props.match.params.id);
    }
    this.state = {
      modalContent: null,
      modalOptions: undefined,
    };
    this.wallet = props.history.location.state ? props.history.location.state : props.wallet;
  }

  callModal = (Component, optionalData) => {
    this.setState({ modalContent: Component, modalOptions: optionalData });
  };

  closeModal = () => {
    this.setState({ modalContent: null });
  };

  render() {
    const ModalContent = this.state.modalContent;
    return has('wid', this.wallet) && this.props.match.params.id === this.wallet.wid ? (
      <Content>
        <Modal>
          {this.state.modalContent ? (
            <ModalContent closeModal={this.closeModal} options={this.state.modalOptions} />
          ) : null}
        </Modal>
        <LeftColumnContainer>
          <WalletInfo
            callModal={this.callModal}
            closeModal={this.closeModal}
            wallet={this.wallet}
          />
          {equals('eth', this.wallet.type) && (
            <Tokens
              wallet={this.wallet}
              fetchTokens={this.props.fetchTokenInfo}
              callModal={this.callModal}
            />
          )}
        </LeftColumnContainer>
        <MiddleColumnContainer>
          <Operations wallet={this.wallet} />
          {wrapedWallet(
            this.props.chartData,
            this.props.getDataForChart,
            this.props.selectedFiat,
            this.wallet.type,
          )}
        </MiddleColumnContainer>
        <RightColumnContainer>
          <Transactions wid={this.props.match.params.id} />
        </RightColumnContainer>
      </Content>
    ) : (
      <CircularProgress />
    );
  }
}

const mapStateToProps = state => ({
  chartData: state.wallets.wallet.get('chartData'),
  wallet: state.wallets.wallet.get('wallet'),
  fiat: state.wallets.wallet.get('fiat'),
  selectedFiat: state.fiat.get('selectedFiat').toJS(),
});

const mapDispatchToProps = dispatch => ({
  getDataForChart: (currency, period, timestamp, fiat) =>
    dispatch(actions.getDataForChart(currency, period, timestamp, fiat)),

  fetchTokenInfo: (type, address) => dispatch(actions.fetchTokenInfo(type, address)),

  getWalletInGaia: selectedWallet => dispatch(actions.getWalletInGaia(selectedWallet)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Wallet);
