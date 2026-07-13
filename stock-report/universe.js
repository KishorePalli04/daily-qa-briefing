'use strict';

/**
 * The stock universe the analyzer scans every day.
 *
 * `yahoo`  – the symbol used against the Yahoo Finance chart/news endpoints.
 *            Australian tickers carry the `.AX` suffix (ASX).
 * `stooq`  – the symbol used by the stooq.com CSV fallback provider.
 * `name`   – human readable company name shown in the report.
 * `market` – 'AU' (Australian / ASX) or 'INTL' (international).
 * `currency` – used purely for display formatting.
 */

const AUSTRALIAN = [
  { yahoo: 'BHP.AX', stooq: 'bhp.au', name: 'BHP Group', currency: 'A$' },
  { yahoo: 'CBA.AX', stooq: 'cba.au', name: 'Commonwealth Bank', currency: 'A$' },
  { yahoo: 'CSL.AX', stooq: 'csl.au', name: 'CSL Limited', currency: 'A$' },
  { yahoo: 'NAB.AX', stooq: 'nab.au', name: 'National Australia Bank', currency: 'A$' },
  { yahoo: 'WBC.AX', stooq: 'wbc.au', name: 'Westpac Banking', currency: 'A$' },
  { yahoo: 'ANZ.AX', stooq: 'anz.au', name: 'ANZ Group', currency: 'A$' },
  { yahoo: 'MQG.AX', stooq: 'mqg.au', name: 'Macquarie Group', currency: 'A$' },
  { yahoo: 'WES.AX', stooq: 'wes.au', name: 'Wesfarmers', currency: 'A$' },
  { yahoo: 'WOW.AX', stooq: 'wow.au', name: 'Woolworths Group', currency: 'A$' },
  { yahoo: 'FMG.AX', stooq: 'fmg.au', name: 'Fortescue', currency: 'A$' },
  { yahoo: 'RIO.AX', stooq: 'rio.au', name: 'Rio Tinto', currency: 'A$' },
  { yahoo: 'TLS.AX', stooq: 'tls.au', name: 'Telstra Group', currency: 'A$' },
  { yahoo: 'WDS.AX', stooq: 'wds.au', name: 'Woodside Energy', currency: 'A$' },
  { yahoo: 'GMG.AX', stooq: 'gmg.au', name: 'Goodman Group', currency: 'A$' },
  { yahoo: 'TCL.AX', stooq: 'tcl.au', name: 'Transurban Group', currency: 'A$' },
  { yahoo: 'WTC.AX', stooq: 'wtc.au', name: 'WiseTech Global', currency: 'A$' },
  { yahoo: 'XRO.AX', stooq: 'xro.au', name: 'Xero', currency: 'A$' },
  { yahoo: 'ALL.AX', stooq: 'all.au', name: 'Aristocrat Leisure', currency: 'A$' },
  { yahoo: 'QAN.AX', stooq: 'qan.au', name: 'Qantas Airways', currency: 'A$' },
  { yahoo: 'COL.AX', stooq: 'col.au', name: 'Coles Group', currency: 'A$' },
  { yahoo: 'REA.AX', stooq: 'rea.au', name: 'REA Group', currency: 'A$' },
  { yahoo: 'PLS.AX', stooq: 'pls.au', name: 'Pilbara Minerals', currency: 'A$' },
  { yahoo: 'NST.AX', stooq: 'nst.au', name: 'Northern Star Resources', currency: 'A$' },
  { yahoo: 'RMD.AX', stooq: 'rmd.au', name: 'ResMed', currency: 'A$' },
  { yahoo: 'JHX.AX', stooq: 'jhx.au', name: 'James Hardie', currency: 'A$' },
].map((t) => ({ ...t, market: 'AU' }));

const INTERNATIONAL = [
  { yahoo: 'AAPL', stooq: 'aapl.us', name: 'Apple', currency: 'US$' },
  { yahoo: 'MSFT', stooq: 'msft.us', name: 'Microsoft', currency: 'US$' },
  { yahoo: 'NVDA', stooq: 'nvda.us', name: 'NVIDIA', currency: 'US$' },
  { yahoo: 'GOOGL', stooq: 'googl.us', name: 'Alphabet', currency: 'US$' },
  { yahoo: 'AMZN', stooq: 'amzn.us', name: 'Amazon', currency: 'US$' },
  { yahoo: 'META', stooq: 'meta.us', name: 'Meta Platforms', currency: 'US$' },
  { yahoo: 'TSLA', stooq: 'tsla.us', name: 'Tesla', currency: 'US$' },
  { yahoo: 'AVGO', stooq: 'avgo.us', name: 'Broadcom', currency: 'US$' },
  { yahoo: 'AMD', stooq: 'amd.us', name: 'Advanced Micro Devices', currency: 'US$' },
  { yahoo: 'NFLX', stooq: 'nflx.us', name: 'Netflix', currency: 'US$' },
  { yahoo: 'JPM', stooq: 'jpm.us', name: 'JPMorgan Chase', currency: 'US$' },
  { yahoo: 'V', stooq: 'v.us', name: 'Visa', currency: 'US$' },
  { yahoo: 'MA', stooq: 'ma.us', name: 'Mastercard', currency: 'US$' },
  { yahoo: 'COST', stooq: 'cost.us', name: 'Costco Wholesale', currency: 'US$' },
  { yahoo: 'LLY', stooq: 'lly.us', name: 'Eli Lilly', currency: 'US$' },
  { yahoo: 'UNH', stooq: 'unh.us', name: 'UnitedHealth Group', currency: 'US$' },
  { yahoo: 'XOM', stooq: 'xom.us', name: 'Exxon Mobil', currency: 'US$' },
  { yahoo: 'WMT', stooq: 'wmt.us', name: 'Walmart', currency: 'US$' },
  { yahoo: 'HD', stooq: 'hd.us', name: 'Home Depot', currency: 'US$' },
  { yahoo: 'CRM', stooq: 'crm.us', name: 'Salesforce', currency: 'US$' },
  { yahoo: 'ORCL', stooq: 'orcl.us', name: 'Oracle', currency: 'US$' },
  { yahoo: 'ADBE', stooq: 'adbe.us', name: 'Adobe', currency: 'US$' },
  { yahoo: 'DIS', stooq: 'dis.us', name: 'Walt Disney', currency: 'US$' },
  { yahoo: 'KO', stooq: 'ko.us', name: 'Coca-Cola', currency: 'US$' },
  { yahoo: 'ASML', stooq: 'asml.us', name: 'ASML Holding', currency: 'US$' },
  { yahoo: 'TSM', stooq: 'tsm.us', name: 'Taiwan Semiconductor', currency: 'US$' },
  { yahoo: 'NVO', stooq: 'nvo.us', name: 'Novo Nordisk', currency: 'US$' },
  { yahoo: 'SHOP', stooq: 'shop.us', name: 'Shopify', currency: 'US$' },
  { yahoo: 'BABA', stooq: 'baba.us', name: 'Alibaba Group', currency: 'US$' },
  { yahoo: 'SAP', stooq: 'sap.us', name: 'SAP SE', currency: 'US$' },
].map((t) => ({ ...t, market: 'INTL' }));

const UNIVERSE = [...AUSTRALIAN, ...INTERNATIONAL];

module.exports = { AUSTRALIAN, INTERNATIONAL, UNIVERSE };
