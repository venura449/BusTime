import axios from 'axios';

// Channel configuration
const CHANNELS = {
  locator1: {
    id: '2957345',
    readApiKey: 'L9SQ6J9HH5MMLIHR',
    writeApiKey: '7KFNJ3NIP7NV47AD'
  },
  locator2: {
    id: '2957092',
    readApiKey: 'I2XIVOUV8SAGEU8B'
  }
};

const BASE_URL = 'https://api.thingspeak.com';

/**
 * Service to interact with ThingSpeak API
 */
class ThingSpeakService {
  /**
   * Fetch the latest data from ThingSpeak channel for a specific locator
   * @param {string} locator - The locator identifier ('locator1' or 'locator2')
   * @param {number} results - Number of results to fetch
   * @returns {Promise<Object>} - Promise resolving to the channel data
   */
  static async fetchChannelData(locator = 'locator2', results = 1) {
    try {
      const channelConfig = CHANNELS[locator];
      if (!channelConfig) {
        throw new Error(`Invalid locator: ${locator}`);
      }

      const response = await axios.get(
        `${BASE_URL}/channels/${channelConfig.id}/feeds.json`,
        {
          params: {
            api_key: channelConfig.readApiKey,
            results
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching channel data for ${locator}:`, error);
      throw error;
    }
  }

  /**
   * Fetch data for a specific field from a specific locator's channel
   * @param {string} locator - The locator identifier ('locator1' or 'locator2')
   * @param {number} fieldNumber - The field number to fetch
   * @param {number} results - Number of results to fetch
   * @returns {Promise<Object>} - Promise resolving to the field data
   */
  static async fetchFieldData(locator = 'locator2', fieldNumber, results = 1) {
    try {
      const channelConfig = CHANNELS[locator];
      if (!channelConfig) {
        throw new Error(`Invalid locator: ${locator}`);
      }

      const response = await axios.get(
        `${BASE_URL}/channels/${channelConfig.id}/fields/${fieldNumber}.json`,
        {
          params: {
            api_key: channelConfig.readApiKey,
            results
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching field ${fieldNumber} data for ${locator}:`, error);
      throw error;
    }
  }

  /**
   * Fetch channel status for a specific locator
   * @param {string} locator - The locator identifier ('locator1' or 'locator2')
   * @returns {Promise<Object>} - Promise resolving to the channel status
   */
  static async fetchChannelStatus(locator = 'locator2') {
    try {
      const channelConfig = CHANNELS[locator];
      if (!channelConfig) {
        throw new Error(`Invalid locator: ${locator}`);
      }

      const response = await axios.get(
        `${BASE_URL}/channels/${channelConfig.id}/status.json`,
        {
          params: {
            api_key: channelConfig.readApiKey
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching channel status for ${locator}:`, error);
      throw error;
    }
  }

  /**
   * Update a field value for a specific locator
   * @param {string} locator - The locator identifier ('locator1' or 'locator2')
   * @param {number} fieldNumber - The field number to update
   * @param {any} value - The value to set
   * @returns {Promise<Object>} - Promise resolving to the update response
   */
  static async updateField(locator, fieldNumber, value) {
    try {
      const channelConfig = CHANNELS[locator];
      if (!channelConfig || !channelConfig.writeApiKey) {
        throw new Error(`Invalid locator or missing write API key: ${locator}`);
      }

      const response = await axios.get(
        `${BASE_URL}/update`,
        {
          params: {
            api_key: channelConfig.writeApiKey,
            [`field${fieldNumber}`]: value
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating field ${fieldNumber} for ${locator}:`, error);
      throw error;
    }
  }
}

export default ThingSpeakService;
