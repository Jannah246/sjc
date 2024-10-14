import { createObjectId } from "../helpers";
import { ICountries } from "../models/countries.model";
import { Obj } from "../types/interfaces";
import db from "../models";

const countriesModel = db.countriesModel;

export const createCountry = async (
  country: Obj
): Promise<ICountries | null> => {
  const countryData = country as ICountries;
  countryData.status = 1;
  return await countriesModel.create(countryData);
};

export const checkCountriesData = async (
  countriesData: Obj,
  id?: string
): Promise<ICountries | null> => {
  const filter: Obj = {
    $or: [
      {
        name: countriesData.name,
      },
      {
        short_name: countriesData.short_name,
      },
      {
        country_code: countriesData.country_code,
      },
      {
        currency_code: countriesData.currency_code,
      },
      {
        name: countriesData.name,
        short_name: countriesData.short_name,
        country_code: countriesData.country_code,
        currency_code: countriesData.currency_code,
      },
    ],
    status: {
      $ne: 0,
    },
  };
  if (id) {
    filter._id = { $ne: createObjectId(id) };
  }

  return await countriesModel.findOne(filter);
};

export const getAllCountries = async (
  status?: string
): Promise<ICountries[] | []> => {
  const filter = {
    status: status
      ? parseInt(status)
      : {
          $ne: 0,
        },
  };

  const results = await countriesModel.find(filter);
  return results;
};

export const getCountryById = async (
  id: string
): Promise<ICountries | null> => {
  return await countriesModel.findOne({ _id: id, status: 1 });
};

export const getCountryByIdWithoutStatus = async (
  id: string
): Promise<ICountries | null> => {
  return await countriesModel.findOne({ _id: id });
};

export const updateStatus = async (
  id: string,
  status: number
): Promise<void> => {
  await countriesModel.updateOne({ _id: id }, { status: status });
  return;
};

export const updateCountry = async (
  id: string,
  country: Obj
): Promise<void> => {
  const countryData = country as ICountries;
  await countriesModel.updateOne({ _id: id }, countryData);
  return;
};
