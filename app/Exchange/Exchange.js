import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import styled from "styled-components";
import * as actions from "./Actions";
import StartExchange from "./StartExchange";
import Confirmation from "./Confirmation";
import StatusExchange from "./StatusExchange";
import IconSwap from "../images/common/icon-swap.svg";

// Import components
import { Button } from "./CommonComponents/Index";

const styles = {};

// Styled
const ExchangeWrapper = styled.div`
  width: 450px;
  height: 380px;
  background-color: #2b3649;
  color: #fff;
  text-overflow: ellipsis;
  position: relative;
  overflow: visible;
  @media (max-width: 768px) {
    order: 3;
    margin: 0 auto;
    width: auto;
  }
`;

const Title = styled.div`
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  span {
    font-size: 14px;
    letter-spacing: 0.26px;
    line-height: 16px;
    position: relative;
    &:after {
      content: "";
      display: block;
      position: absolute;
      right: -30px;
      top: 50%;
      transform: translateY(-50%);
      width: 16px;
      height: 12px;
      background-image: url(${IconSwap});
    }
  }
`;

const tabs = [
  { name: "Start Exchange", value: 1, render: <StartExchange /> },
  { name: "Confirmation", value: 2, render: <Confirmation /> },
  { name: "Exchange detalls", value: 3, render: <StatusExchange /> }
];

class Exchange extends React.Component {
  render() {
    return (
      <ExchangeWrapper>
        <Title>
          <span className="swap">Exchange your funds</span>
          {this.props.activeTabId === 2 && (
            <Button onClick={() => this.props.mountActiveTab(0)}>
              New Order
            </Button>
          )}
        </Title>
        <Divider style={{ backgroundColor: "rgba(141,150,178,0.1)" }} />
        <div style={{ padding: "20px", paddingTop: "25px" }}>
          {tabs[this.props.activeTabId].render}
        </div>
      </ExchangeWrapper>
    );
  }
}

const mapStateToProps = state => ({
  wallets: state.exchange.wallets,
  activeTabId: state.exchange.activeTabId
});

const mapDispatchToProps = dispatch => ({
  fetchWallets: () => dispatch(actions.fetchWallets()),
  mountActiveTab: tabId => dispatch(actions.mountActiveTab(tabId))
});

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Exchange)
);
