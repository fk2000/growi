import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import {
  Modal, ModalBody, Nav, NavItem, NavLink, TabContent, TabPane,
} from 'reactstrap';

import { withTranslation } from 'react-i18next';

import PageListIcon from './Icons/PageListIcon';
import TimeLineIcon from './Icons/TimeLineIcon';
import RecentChangesIcon from './Icons/RecentChangesIcon';
import AttachmentIcon from './Icons/AttachmentIcon';
import ShareLinkIcon from './Icons/ShareLinkIcon';

import { withUnstatedContainers } from './UnstatedUtils';
import PageAccessoriesContainer from '../services/PageAccessoriesContainer';
import PageAttachment from './PageAttachment';
import PageTimeline from './PageTimeline';
import PageList from './PageList';
import PageHistory from './PageHistory';
import ShareLink from './ShareLink/ShareLink';

const navTabMapping = [
  {
    icon: <PageListIcon />,
    id: 'pagelist',
    i18n: 'page_list',
  },
  {
    icon: <TimeLineIcon />,
    id: 'timeline',
    i18n: 'Timeline View',
  },
  {
    icon: <RecentChangesIcon />,
    id: 'page-history',
    i18n: 'History',
  },
  {
    icon: <AttachmentIcon />,
    id: 'attachment',
    i18n: 'attachment_data',
  },
  {
    icon: <ShareLinkIcon />,
    id: 'share-link',
    i18n: 'share_links.share_link_management',
  },
];

const PageAccessoriesModal = (props) => {
  const { t, pageAccessoriesContainer } = props;
  const { switchActiveTab } = pageAccessoriesContainer;
  const { activeTab } = pageAccessoriesContainer.state;

  const sliderEl = useRef(null);
  const navLinkEls = useRef([]);

  navTabMapping.forEach((data, i) => {
    navLinkEls.current[i] = React.createRef();
  });

  function closeModalHandler() {
    if (props.onClose == null) {
      return;
    }
    props.onClose();
  }

  const menu = document.getElementsByClassName('nav');
  const arrayMenu = Array.from(menu);

  const navTitle = document.getElementById('nav-title');

  // Might make this dynamic for px, %, pt, em
  function getPercentage(min, max) {
    return min / max * 100;
  }

  // Not using reduce, because IE8 doesn't supprt it
  function getArraySum(arr) {
    let sum = 0;
    [].forEach.call(arr, (el, index) => {
      sum += el;
    });
    return sum;
  }

  function changeFlexibility(width, tempMarginLeft) {
    sliderEl.current.width = `${width}%`;
    sliderEl.current.style.marginLeft = `${tempMarginLeft}%`;
  }

  function navSlider(menu, callback) {
    // We only want the <li> </li> tags
    const navTabs = document.querySelectorAll('li.nav-link');

    if (menu.length === 0) {
      return;
    }

    const marginLeft = [];
    // Loop through nav children i.e li
    [].forEach.call(navTabs, (el, index) => {
      // Dynamic width/margin calculation for hr
      const width = getPercentage(el.offsetWidth, navTitle.offsetWidth);
      let tempMarginLeft = 0;
      // We don't want to modify first elements positioning
      if (index !== 0) {
        tempMarginLeft = getArraySum(marginLeft);
      }
      // Set mouse event [click]
      callback(el, width, tempMarginLeft);
      /* We store it in array because the later accumulated value is used for positioning */
      marginLeft.push(width);
    });
  }

  navSlider(arrayMenu, (el, width, tempMarginLeft) => {
    el.onclick = () => {
      changeFlexibility(width, tempMarginLeft);
    };
  });

  return (
    <React.Fragment>
      <Modal size="xl" isOpen={props.isOpen} toggle={closeModalHandler} className="grw-page-accessories-modal">
        <ModalBody>
          <Nav className="nav-title" id="nav-title">
            {navTabMapping.map((tab, index) => {
              return (
                <NavItem key={tab.id} type="button" className={`nav-link ${activeTab === tab.id && 'active'}`}>
                  <NavLink innerRef={navLinkEls.current[index]} onClick={() => { switchActiveTab(tab.id) }}>
                    {tab.icon}
                    {t(tab.i18n)}
                  </NavLink>
                </NavItem>
              );
            })}
          </Nav>
          <hr ref={sliderEl} id="nav_slide_click" className="my-0" />
          <TabContent activeTab={activeTab}>
            <TabPane tabId="pagelist">
              {pageAccessoriesContainer.state.activeComponents.has('pagelist') && <PageList />}
            </TabPane>
            <TabPane tabId="timeline" className="p-4">
              {pageAccessoriesContainer.state.activeComponents.has('timeline') && <PageTimeline /> }
            </TabPane>
            <TabPane tabId="page-history">
              <div className="overflow-auto">
                {pageAccessoriesContainer.state.activeComponents.has('page-history') && <PageHistory /> }
              </div>
            </TabPane>
            <TabPane tabId="attachment" className="p-4">
              {pageAccessoriesContainer.state.activeComponents.has('attachment') && <PageAttachment />}
            </TabPane>
            <TabPane tabId="share-link" className="p-4">
              {pageAccessoriesContainer.state.activeComponents.has('share-link') && <ShareLink />}
            </TabPane>
          </TabContent>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

/**
 * Wrapper component for using unstated
 */
const PageAccessoriesModalWrapper = withUnstatedContainers(PageAccessoriesModal, [PageAccessoriesContainer]);

PageAccessoriesModal.propTypes = {
  t: PropTypes.func.isRequired, //  i18next
  // pageContainer: PropTypes.instanceOf(PageContainer).isRequired,
  pageAccessoriesContainer: PropTypes.instanceOf(PageAccessoriesContainer).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
};

export default withTranslation()(PageAccessoriesModalWrapper);
