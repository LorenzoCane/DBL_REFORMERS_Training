# SEIA Training Tool

The live preview can be found at [this page](https://lorenzocane.github.io/DBL_REFORMERS_Training/).

A web-based tool thought for training. This tool helps you calculate Social and Environmental Impact Assessment (SEIA) and Social Return on
Investment (SROI). This application  helps people and organitations in their learning process about SEIA and SROI. The social impact of your project is here calculate combining proxy values and stakeholder weighting.

## Features Overview

The current version of the SEIA Training Tools includes:
- **Dynamic Indicator Management**: Add, edit, and remove social/environmental impact indicators
- **Proxy-Based Valuation**: Assign multiple monetary proxies to each indicator and see their combined value
- **Stakeholder Weighting**: Prioritize indicators based on stakeholder importance (1-10 scale)
- **Automatic Calculations**: Real-time calculation of raw values, multipliers, and Total social value
- **Custom Multiplier System**: Increase the social value of proxies using stakeholder importance:

    - *Low Priority* (1-3) : 1.0x multiplier
    - *Medium Priority* (4-7) : 1.25x multiplier 
    - *High Priority* (8-10) : 1.5x multiplier (High priority)


- **CSV Export**: Download complete analysis for further processing
- **Reset Functionality**: If you feel lost, restore default example indicators
- **No Dependencies** : Pure HTML, CSS, and vanilla JavaScript

## Demo
The tool comes witha a pre-loaded example with three indicators, some proxies and reasonable values.
Feel free to modify the SEIA with your data, and if you feel lost you can always click on "*Default Setup*" button tpo restart from the pre-loaded example.

## Usage : Your Rapid Guide

### Adding a New Indicator

1. Click the "➕ *Add New Indicator*" button
2. Enter the indicator name (e.g., "Reduced Carbon Emissions")
3. Set the stakeholder weight (1-10)
4. Add proxies with monetary values

### Adding Proxies

1. Within any indicator card, click "➕ *Add new proxy*" in the Proxies section
2. Enter the proxy name (e.g., "Reduced cancer incidence")
3. Enter the monetary value in euros

### Understanding Results
For each indicator, you'll see:

- **Raw Value**: Sum of all proxy values
- **Multiplier**: Based on stakeholder weight (1.0, 1.25, or 1.5)
- **Result**: Raw Value × Multiplier

The **Total Social Impact Value** box shows the sum of all indicator results.

### Exporting Data
Click "📥 Export CSV" to download a spreadsheet with:

- All indicators and their weights
- All proxies and values
- Calculated raw values, multipliers, and results
- Total impact value

### Resetting to Default
Click "🔄 *Reset to Default*" to restore the default example and clear any custom additions.

## Calculation Methodology

### Social Value Formula:

```
Result = Raw Value × Multiplier

Where:
- Raw Value = Sum of all proxy values for an indicator
- Multiplier = f(Stakeholder Weight)
  - If weight ∈ [1,3]: Multiplier = 1.0
  - If weight ∈ [4,7]: Multiplier = 1.25
  - If weight ∈ [8,10]: Multiplier = 1.5

Total Impact = Σ(Result for all indicators)
```

## Contributing 

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Maintain ES5 compatibility for broad browser support
- Use semantic HTML and accessible markup
- Follow the existing code organization pattern
- Test across multiple browsers
- Update documentation for new features
- Add yourself here in the author

## Contact
For questions,  suggestions, support, or any issues:
- Maintainer : Lorenzo Cane, Dev&AI Consultant - Enviroment & Energy Area at @ [Deep Blue S.r.l.](https://dblue.it/en/)
- Email: lorenzo.cane@dblue.it

## Acknowledgments
This tools is part of the [REFORMERS Project](https://reformers-energyvalleys.eu/), which received funding from the European Union’s research and innovation programme Horizon Europe under the grant agreement No.101136211 and Swiss Confederation. 

## Further Reading 

- [Social return on investment](https://en.wikipedia.org/wiki/Social_return_on_investment)