import React, { useEffect, useState } from 'react';
//import { Button, FormSelect } from 'react-bootstrap';
import './BrowseView.css';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import 'antd/dist/antd.css';

import CityHack from './CityHack.js';

import { Form, Button, Select } from 'antd';

const BrowseView = (props) => {
  const [hackIdsVoted, setHackIdsVoted] = useState([]);
  const [hackIdsVotes, setHackIdsVotes] = useState([]);
  const [cityId, setCityId] = useState(0);
  const [categoryId, setCategoryId] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);

  const cities = [
    'All Cities',
    'Barcelona',
    'Buenos Aires',
    'Lisbon',
    'Madrid',
    'London',
    'Tokyo',
    'New York',
    'San Francisco',
    'Berlin',
    'Paris',
    'Rome',
    'Athens',
  ];

  const categories = [
    'All categories',
    'Cheap Places',
    'Nice Spots',
    'Traditional',
    'Parking',
    'Coworking',
    'Misc',
  ];

  const handleVote = async (vote, hackId) => {
    await props.voteHack(hackId, vote);
    await props.getAllHacks();
    props.fetchEvents();
  };

  useEffect(() => {
    setHackIdsVoted(props.votedHacks.map((votedHack) => votedHack.hackId));
    setHackIdsVotes(props.votedHacks.map((votedHack) => votedHack.vote));
  }, [props.votedHacks]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setLoading(props.hacks.length === 0 && !filtering);
    setFiltering(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.hacks]);

  const searchHacks = () => {
    let filters = {};
    if (cityId !== 0) {
      filters = { city: cities[cityId] };
      if (categoryId !== 0) {
        filters.category = categories[categoryId];
      }
    }
    setFiltering(true);
    props.setFilters(filters);
  };

  const getCategoryAndCityRecommendationsTitle = () => {
    // eslint-disable-next-line
    return `${categories[categoryId]}` + ' in ' + `${cities[cityId]}`;
  };

  const getCityRecommendationsTitle = () => {
    // eslint-disable-next-line
    return 'Latest recommendations in ' + `${cities[cityId]}`;
  };

  return (
    <div>
      <div className="selectorsContainer">
        <Form layout="inline" size="small">
          <Form.Item>
            <Select
              style={{ margin: '0px' }}
              value={cityId}
              aria-label="Default select example"
              onChange={(e) => setCityId(e)}
            >
              {cities.map((city, index) => {
                return (
                  <Select.Option key={'city' + index} value={index}>
                    {city}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item>
            <Select
              style={{ margin: '0px' }}
              value={categoryId}
              disabled={cityId === 0}
              aria-label="Default select example"
              onChange={(e) => setCategoryId(e)}
            >
              {categories.map((category, index) => {
                return (
                  <Select.Option key={'category' + index} value={index}>
                    {category}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Button
            className="tipButton"
            variant="outline-secondary"
            id="button-addon2"
            onClick={() => searchHacks()}
          >
            Search
          </Button>
        </Form>
      </div>
      <div>
        {loading ? (
          <Loader
            className="loader"
            type="Watch"
            color="#00BFFF"
            height={50}
            width={50}
          />
        ) : (
          <div className="cityhacks">
            <div className="headerContainer">
              <h3 className="headerTitle">
                {categoryId !== 0 && props.hacks.length > 0
                  ? getCategoryAndCityRecommendationsTitle()
                  : props.hacks.length === 0
                  ? ''
                  : getCityRecommendationsTitle()}
              </h3>
            </div>
            {props.hacks.length === 0 && (
              <h2
                className="headerTitle"
                style={{ justifyContent: 'center', display: 'flex' }}
              >
                No results for this category
              </h2>
            )}
            {props.hacks.map((hack, index) => {
              return (
                <CityHack
                  key={index}
                  hack={hack}
                  hackIdsVoted={hackIdsVoted}
                  hackIdsVotes={hackIdsVotes}
                  handleVote={handleVote}
                  handleReport={props.handleReport}
                  handleTip={props.handleTip}
                  disabledVotes={props.disabledVotes}
                  invalidNetwork={props.invalidNetwork}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseView;
