/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

// Note that these are webpack requires, not CommonJS node requiring requires
const React = require('react')
const ImmutableComponent = require('../components/immutableComponent')
const Immutable = require('immutable')
const cx = require('../lib/classSet.js')
const AppConfig = require('../constants/appConfig')
const preferenceTabs = require('../constants/preferenceTabs')
const messages = require('../constants/messages')
const settings = require('../constants/settings')
const ipc = require('./ipc')

// TODO: Determine this from the l20n file automatically
const hintCount = 3

// Stylesheets
require('../../less/about/preferences.less')
require('../../node_modules/font-awesome/css/font-awesome.css')

class GeneralTab extends ImmutableComponent {
  changeSetting (key, e) {
    ipc.send(messages.CHANGE_SETTING, key, e.target.value)
  }
  render () {
    return <div className='settingsList'>
      <div className='settingItem'>
        <span data-l10n-id='startsWith'/>
        <select value={this.props.settings.get(settings.STARTUP_MODE)}
           onChange={this.changeSetting.bind(this, settings.STARTUP_MODE)} >
           <option data-l10n-id='startsWithOptionLastTime' value='lastTime'/>
           <option data-l10n-id='startsWithOptionHomePage' value='homePage'/>
           <option data-l10n-id='startsWithOptionNewWindow' value='newWindow'/>
        </select>
        </div>
    </div>
  }
}

class SearchTab extends ImmutableComponent {
  render () {
    return <div>
      Search tab settings coming soon
    </div>
  }
}

class TabsTab extends ImmutableComponent {
  render () {
    return <div>
      Tabs settings coming soon
    </div>
  }
}

class SyncTab extends ImmutableComponent {
  render () {
    return <div>
      Sync settings coming soon
    </div>
  }
}

class PrivacyTab extends ImmutableComponent {
  render () {
    return <div>
      Privacy settings coming soon
    </div>
  }
}

class SecurityTab extends ImmutableComponent {
  render () {
    return <div>
      Security settings coming soon
    </div>
  }
}

class BraveryTab extends ImmutableComponent {
  render () {
    return <div>
      Bravery settings coming soon
    </div>
  }
}

class TopBarButton extends ImmutableComponent {
  render () {
    return <div className={cx({
      selected: this.props.selected
    })}>
      <div onClick={this.props.onClick}
        className={cx({
          topBarButton: true,
          fa: true,
          [this.props.icon]: true
        })}>
        <div className='tabMarkerText'
          data-l10n-id={this.props.dataL10nId}/>
      </div>
      { this.props.selected
      ? <div className='tabMarkerContainer'>
          <div className='tabMarker'/>
        </div> : null }
    </div>
  }
}

class TopBar extends ImmutableComponent {
  render () {
    return <div className='preferencesTopBar'>
      <TopBarButton icon='fa-list-alt'
        dataL10nId='general'
        onClick={this.props.changeTab.bind(null, preferenceTabs.GENERAL)}
        selected={this.props.preferenceTab === preferenceTabs.GENERAL}
      />
      <TopBarButton icon='fa-search'
        dataL10nId='search'
        onClick={this.props.changeTab.bind(null, preferenceTabs.SEARCH)}
        selected={this.props.preferenceTab === preferenceTabs.SEARCH}
      />
      <TopBarButton icon='fa-bookmark-o'
        dataL10nId='tabs'
        onClick={this.props.changeTab.bind(null, preferenceTabs.TABS)}
        selected={this.props.preferenceTab === preferenceTabs.TABS}
      />
      <TopBarButton icon='fa-refresh'
        dataL10nId='sync'
        onClick={this.props.changeTab.bind(null, preferenceTabs.SYNC)}
        selected={this.props.preferenceTab === preferenceTabs.SYNC}
      />
      <TopBarButton icon='fa-user'
        dataL10nId='privacy'
        onClick={this.props.changeTab.bind(null, preferenceTabs.PRIVACY)}
        selected={this.props.preferenceTab === preferenceTabs.PRIVACY}
      />
      <TopBarButton icon='fa-lock'
        dataL10nId='security'
        onClick={this.props.changeTab.bind(null, preferenceTabs.SECURITY)}
        selected={this.props.preferenceTab === preferenceTabs.SECURITY}
      />
      <TopBarButton onClick={this.props.changeTab.bind(null, preferenceTabs.BRAVERY)}
        dataL10nId='bravery'
        selected={this.props.preferenceTab === preferenceTabs.BRAVERY}
      />
    </div>
  }
}

class HelpfulHints extends ImmutableComponent {
  sendUsFeedback () {
    ipc.send(messages.SHORTCUT_NEW_FRAME, AppConfig.contactUrl)
  }

  render () {
    return <div className='helpfulHints'>
      <span className='hintsTitleContainer'>
        <span data-l10n-id='hintsTitle'/>
        <span className='hintsRefresh fa fa-refresh'
          onClick={this.props.refreshHint}/>
      </span>
      <div data-l10n-id={`hint${this.props.hintNumber}`}/>
      <div className='helpfulHintsBottom'>
        <a data-l10n-id='sendUsFeedback' onClick={this.sendUsFeedback.bind(this)} />
        <div className='loveToHear' data-l10n-id='loveToHear'/>
      </div>
    </div>
  }
}

class AboutPreferences extends React.Component {
  constructor () {
    super()
    this.state = {
      preferenceTab: preferenceTabs.GENERAL,
      hintNumber: this.getNextHintNumber()
    }
    ipc.on(messages.SETTINGS_UPDATED, (e, settings) => {
      this.setState({
        settings
      })
    })
  }

  changeTab (preferenceTab) {
    ipc.send('set-about-state', preferenceTab)
    this.setState({
      preferenceTab
    })
  }

  refreshHint () {
    this.setState({
      hintNumber: this.getNextHintNumber()
    })
  }

  getNextHintNumber () {
    // Try for a new random number at most 10 times.
    // Avoiding the same tip twice is good because people may think the
    // refresh button is broken.
    let newNumber
    for (let i = 0; i < 10; ++i) {
      newNumber = Math.random() * hintCount | 0
      if (!this.state || newNumber !== this.state.hintNumber) {
        break
      }
    }
    return newNumber
  }

  render () {
    let tab
    const settings = Immutable.fromJS(this.state.settings || {})
    switch (this.state.preferenceTab) {
      case preferenceTabs.GENERAL:
        tab = <GeneralTab settings={settings}/>
        break
      case preferenceTabs.SEARCH:
        tab = <SearchTab settings={settings}/>
        break
      case preferenceTabs.TABS:
        tab = <TabsTab settings={settings}/>
        break
      case preferenceTabs.SYNC:
        tab = <SyncTab settings={settings}/>
        break
      case preferenceTabs.PRIVACY:
        tab = <PrivacyTab settings={settings}/>
        break
      case preferenceTabs.SECURITY:
        tab = <SecurityTab settings={settings}/>
        break
      case preferenceTabs.BRAVERY:
        tab = <BraveryTab settings={settings}/>
        break
    }
    return <div>
      <TopBar preferenceTab={this.state.preferenceTab}
        changeTab={this.changeTab.bind(this)}/>
      <div className='prefBody'>
        <div className='prefTabContainer'>
          {tab}
        </div>
        <HelpfulHints hintNumber={this.state.hintNumber} refreshHint={this.refreshHint.bind(this)}/>
      </div>
    </div>
  }
}

module.exports = <AboutPreferences/>
