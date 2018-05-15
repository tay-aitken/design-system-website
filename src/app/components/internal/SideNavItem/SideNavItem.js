import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class SideNavItem extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.func,
    isCurrentPath: PropTypes.bool,
    isActiveItem: PropTypes.bool,
    type: PropTypes.string
  };

  state = {
    open: this.props.isCurrentPath
  };

  handleClick = evt => {
    const targetIsSubItem = evt.target.classList.contains('sub-nav__item') || evt.target.classList.contains('sub-nav__item-link') || evt.target.classList.contains('sub-nav-item__arrow');
    const hasSubMenu = !(evt.currentTarget.querySelector('ul') === null);
    const targetIsInnerSubNav = evt.currentTarget.classList.contains('main-nav-item--sub');
    const targetIsInnerSubNavItem = evt.target.classList.contains('sub-nav__item-link--sub');
    const targetIsInnerSubNavItemContainer = evt.target.classList.contains('sub-nav__item--sub');
    const targetIsArrow = evt.target.nodeName === 'path';
    if ((!targetIsSubItem && hasSubMenu) || (targetIsInnerSubNav && !targetIsInnerSubNavItem && !targetIsInnerSubNavItemContainer)) {
      if (!targetIsArrow) {
        const open = !this.state.open;
        this.setState({ open });
        const subMenu = evt.currentTarget.querySelector('ul');
        if (!this.state.open) {
          let height = 0;
          [...subMenu.children].forEach(child => {
            height += child.offsetHeight;
          });
          subMenu.style.maxHeight = `${height + 400}px`;
        } else {
          const isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
          if (!evt.currentTarget.classList.contains('main-nav-item__open') && isIE11) {
            subMenu.style.maxHeight = 0;
          } else if (!isIE11) {
            subMenu.style.maxHeight = 0;
          }
        }
      }
    }
  };

  handleKeyDown = evt => {
    if (evt.which === 13 && evt.target === evt.currentTarget) { // Does not handle bubbled up events
      const open = !this.state.open;
      this.setState({ open });
      const subMenu = this.elem.querySelector('ul');
      if (!this.state.open) {
        let height = 0;
        [...subMenu.children].forEach(child => {
          height += child.offsetHeight;
        });
        subMenu.style.maxHeight = `${height}px`;
      } else {
        const isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
        if (!this.elem.classList.contains('main-nav-item__open') && isIE11) {
          subMenu.style.maxHeight = 0;
        } else if (!isIE11) {
          subMenu.style.maxHeight = 0;
        }
      }
    }
    if (evt.which === 39) {
      document.querySelector('#maincontent').focus();
    }
  };

  handleRef = elem => {
    this.elem = elem;
  };

  render() {
    const isSub = this.props.type === 'sub';
    const { children, isActiveItem } = this.props;
    const { open } = this.state;

    const classNames = classnames({
      'main-nav-item': true,
      'main-nav-item__open': open,
      'main-nav-item__active': isActiveItem,
      'main-nav-item--sub': isSub,
    });

    const tabIndex = children.length && !isSub ? 0 : undefined;

    return (
      <li role="menuitem" tabIndex={tabIndex} className={classNames} onClick={this.handleClick} onKeyDown={this.handleKeyDown} ref={this.handleRef}>
        {children({ open, onKeyDown: this.handleKeyDown })}
      </li>
    );
  }
}

export default SideNavItem;
