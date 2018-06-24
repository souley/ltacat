import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import * as productService from '../../services/product-service';
import Select from 'react-select';
import { JSONEditor } from "react-schema-based-json-editor";
let libraries = {};
let order= 'desc';

//  =========================================
//  Formatting functions
//  =========================================
function enumFormatter(cell, row, enumObject) {
  return enumObject[cell];
}

function isBlank(str) {
  return (!str || /^\s*$/.test(str));
}

function linkFormatter(link) {
  // return a <a href=> link if link is not null, else return <p></p>
  if (!isBlank(link)) {
    return <a href={link}>Data link</a>;
  }
  else {
    return <p></p>;
  }
}

function floatFormatter(number, decimals) {
  // safeguard use of parseFloat to not return NaN
  // return floating point number with decimals as provided in input
  const flt = parseFloat(number).toFixed(decimals)
  if (!isNaN(flt)) {
    return flt;
  }
  else {
    return <p></p>;
  }
}

function unitsFormatter(value, unitstr) {
  // return [unitstr] if value is defined, else return <p></p>
  if (!isNaN(parseFloat(value))) {
    return <div>{unitstr}</div>;
  }
  else {
    return ;
  }
}
  
function subsupstr_formatter(variable, substrng, description, superscript) {
  if ((!isBlank(substrng)) && (!isBlank(description))) {
    return <div>{variable}<span className='supsub'><sub><b>{substrng}</b></sub></span><span className='subsup'><sup><b>{superscript}</b></sup></span></div>;
  }
  else if (!isBlank(description)) {
    return <div>{variable}<span className='subsup'><sup><b>{superscript}</b></sup></span></div>;
  }
  else if (!isBlank(substrng)) {
    return <div>{variable}<span className='supsub'><sub><b>{substrng}</b></sub></span></div>;
  }
  else {
    return variable;
  }
}

function supsub_formatter(variable, upper_error, lower_error) {
  // return variable with upper/lower error if available, else return variable
  if (!isNaN(parseFloat(upper_error)) && !isNaN(parseFloat(lower_error))) {
    //return variable with upper and lower error
    return <div>{variable}<span className='supsub'><sup>{upper_error}</sup><sub>{lower_error}</sub></span></div>;
  }
  else {
    // return variable without error
    return variable;
  }
}

function plusmn_formatter(variable, error) {
  // return variable with +-error if available, else return variable
  if (!isNaN(parseFloat(error))) {
    return <div>{variable}&plusmn;{error}</div>;
  }
  else {
    // return variable
    return variable;
  }
}

function htmlFormatter(cell) {
  if ((cell === '-1')) {
    return;
  } else {
    return he.decode(`${cell}`);
  }
}

function priceFormatter(cell, row) {
  if ((cell === '-1')) {
    return;
  } else {
    return `${cell}`;
  }
}

function nanFormatter(cell, row) {
  if ((cell === -1)) {
    return;
  } else {
    return cell;
  }
}

function uint8ToBase64(buffer) {
     var binary = '';
     var len = buffer.byteLength;
     for (var i = 0; i < len; i++) {
         binary += String.fromCharCode(buffer[i]);
     }
     return window.btoa( binary );
}

function nextChar(index) {
  // convert int to lower case character 0->a, 1->b, etc
  return String.fromCharCode(97 + index);
}

function superscript_list(itemlist) {
  // return superscript list for the items in itemlist
  // first item gets letter a ,second b, etc
  return <div>
    <p></p>
    {
      itemlist.map(function(item, i){
       char = nextChar(i);
       if (!isBlank(item)) {
         return <p key={i}>[{char}] {item}</p>
       }
       else {
         return
       }
    })
  }
  </div>;
}


//  =========================================
//  Sorting function
//  =========================================

function NaturalSortFunc(a, b, order, sortField) {
  /*
   * Based on the
   * Natural Sort algorithm for Javascript - Version 0.8.1 - Released under MIT license
   * Author: Jim Palmer (based on chunking idea from Dave Koelle)
   */
  var re = /(^([+\-]?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?(?=\D|\s|$))|^0x[\da-fA-F]+$|\d+)/g,
  sre = /^\s+|\s+$/g,   // trim pre-post whitespace
  snre = /\s+/g,        // normalize all whitespace to single ' ' character
  dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
  hre = /^0x[0-9a-f]+$/i,
  ore = /^0/,
  i = function(s) {
    return (NaturalSortFunc.insensitive && ('' + s).toLowerCase() || '' + s).replace(sre, '');
  }
  if (order === 'asc') {
    // convert all to strings strip whitespace
    var x = i(a[sortField]),
    y = i(b[sortField])
  } else {
    var x = i(b[sortField]),
    y = i(a[sortField])
  }
    // chunk/tokenize
  var xN = x.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
  yN = y.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
  // numeric, hex or date detection
  xD = parseInt(x.match(hre), 16) || (xN.length !== 1 && Date.parse(x)),
  yD = parseInt(y.match(hre), 16) || xD && y.match(dre) && Date.parse(y) || null,
  normChunk = function(s, l) {
    // normalize spaces; find floats not starting with '0', string or 0 if not defined (Clint Priest)
    return (!s.match(ore) || l == 1) && parseFloat(s) || s.replace(snre, ' ').replace(sre, '') || 0;
  },
  oFxNcL, oFyNcL;
  // first try and sort Hex codes or Dates
  if (yD) {
    if (xD < yD) { return -1; }
    else if (xD > yD) { return 1; }
  }
  // natural sorting through split numeric strings and default strings
  for(var cLoc = 0, xNl = xN.length, yNl = yN.length, numS = Math.max(xNl, yNl); cLoc < numS; cLoc++) {
    oFxNcL = normChunk(xN[cLoc] || '', xNl);
    oFyNcL = normChunk(yN[cLoc] || '', yNl);
    // handle numeric vs string comparison - number < string - (Kyle Adams)
    if (isNaN(oFxNcL) !== isNaN(oFyNcL)) {
      return isNaN(oFxNcL) ? 1 : -1;
    }
    // if unicode use locale comparison
    if (/[^\x00-\x80]/.test(oFxNcL + oFyNcL) && oFxNcL.localeCompare) {
      var comp = oFxNcL.localeCompare(oFyNcL);
      return comp / Math.abs(comp);
    }
    if (oFxNcL < oFyNcL) { return -1; }
    else if (oFxNcL > oFyNcL) { return 1; }
  }
}

//  =========================================
//  Images for radio measured params
//  =========================================

class PipelineConfigurator extends React.Component {
    // Pipelone json configurator
  constructor(props) {
    super(props);
    this.state = { pipelineConfig: {},
                   initialConfig: {}
    };
    this.findConfigProps = this.findConfigProps.bind(this);
    this.updateDerived = this.updateDerived.bind(this);
  }
  componentDidMount() {
    this.findConfigProps(this.props.pipeline);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.pipeline !== this.props.pipeline) {
        this.findConfigProps(this.emptyObject(nextProps.pipeline));
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.pipeline !== nextProps.pipeline || nextState.pipelineConfig !== this.state.pipelineConfig
  }
  updateDerived() {
    return
  }
  submit() {
    return
  }
  emptyObject(obj) {
    if (obj == null) {
        return {}
    }
    else {
        return obj
    }
  }
  findConfigProps(pline) {
    // Find configuration properties for selected pipeline
    // hardcode for now
    //this.props.pipeline
  var schema = {
  "type": "object",
  "title": "Configuration Parameters:",
  "description": "This is the LOFAR GRID Pre-Processing Pipeline. Here we print a description of the pipeline.",
  "properties": {
    "AVG_FREQ_STEP": {
      "type": "integer",
      "title": "AVG_FREQ_STEP",
      "description": "corresponds to .freqstep in NDPPP .type=average , or in case of .type=demixer it is the demixer.freqstep",
      "default": 2,
      "minimum": 0,
      "exclusiveMinimum": true,
      "maximum": 1000,
      "exclusiveMaximum": true,    
      "propertyOrder": 1
    },
    "AVG_TIME_STEP": {
      "type": "integer",
      "title": "AVG_TIME_STEP",
      "description": "corresponds to .timestep in NDPPP .type=average , or in case of .type=demixer it is the demixer.timestep",
      "default": 4,
      "minimum": 0,
      "exclusiveMinimum": true,
      "maximum": 1000,
      "exclusiveMaximum": true,    
      "propertyOrder": 2
    },
    "DO_DEMIX": {
      "type": "boolean",
      "title": "DO_DEMIX",
      "description": "if true then demixer instead of average is performed",
      "default": true,
      "propertyOrder": 3
    },
    "DEMIX_FREQ_STEP": {
      "type": "integer",
      "title": "DEMIX_FREQ_STEP",
      "description": "corresponds to .demixfreqstep in NDPPP .type=demixer",
      "default": 2,
      "minimum": 0,
      "exclusiveMinimum": true,
      "maximum": 1000,
      "exclusiveMaximum": true,    
      "propertyOrder": 4
    },
    "DEMIX_TIME_STEP": {
      "type": "integer",
      "title": "DEMIX_TIME_STEP",
      "description": "corresponds to .demixtimestep in NDPPP .type=demixer",
      "default": 2,
      "minimum": 0,
      "exclusiveMinimum": true,
      "maximum": 1000,
      "exclusiveMaximum": true,    
      "propertyOrder": 5
    },
    "DEMIX_SOURCES": {
      "type": "string",
      "description": "",
      "title": "DEMIX_SOURCES",
      "format": "select",
      "enum": [
        "CasA",
        "CygA"
      ],
      "propertyOrder": 6
    },
    "SELECT_NL": {
      "type": "boolean",
      "title": "SELECT_NL",
      "description": "if true then only Dutch stations are selected",
      "default": true,
      "propertyOrder": 7
    },
    "PARSET": {
      "type": "string",
      "title": "PARSET",
      "description": "",
      "format": "select",
      "enum": [
        "",
        "hba_npp",
        "hba_raw",
        "lba_npp",
        "lba_raw"
      ],
      "default": "lba_npp",
      "propertyOrder": 8
    },
    "required": [
        "AVG_FREQ_STEP",
        "AVG_TIME_STEP",
        "DO_DEMIX",
        "DEMIX_FREQ_STEP",
        "DEMIX_TIME_STEP",
        "DEMIX_SOURCES",
        "SELECT_NL",
        "PARSET"
    ]
    }};
    var initialValue = {
        "AVG_FREQ_STEP": 2,
        "AVG_TIME_STEP": 4,
        "DO_DEMIX": true,
        "DEMIX_FREQ_STEP": 2,
        "DEMIX_TIME_STEP": 2,
        "DEMIX_SOURCES": "CasA",
        "SELECT_NL": true,
        "PARSET": "lba_npp"
    };
    // catch TypeError: can't convert null to object
    try {
        if ( Object.getOwnPropertyNames(pline).length !== 0) {
            this.setState({
                pipelineConfig: schema,
                initialConfig: initialValue,
               });
        } else {
            this.setState({
                pipelineConfig: {},
                initialConfig: {},
            });
        }
    } catch (e) {
            this.setState({
                pipelineConfig: {},
                initialConfig: {},
            });
    }        
  }
  render () {

    // make sure we have all images loaded before rendering the gallery
    if ( Object.getOwnPropertyNames(this.state.pipelineConfig).length == 0 ) {
      return (
        <div></div>
      );
    } else {
      return (
        <div>
        <JSONEditor 
            title="Pipeline configuration"
            schema={this.state.pipelineConfig}
            initialValue={this.state.initialConfig}
            updateValue={this.updateDerived}
            theme="bootstrap4"
            icon="fontawesome5">
        </JSONEditor>
      <p></p>
      <p></p>
      <button type='button'
      className={ `btn btn-submit` }
      title='Submit workflow'
      onClick={this.submit}>
      Submit workflow
      </button>
      </div>
      );
    }
  }
}

class RmpImagesComponent extends React.Component {
  // Render image gallery for radio measured params images
  constructor(props) {
    super(props);
    this.state = { rmp_images: [],
                   dimensions: [],
                   objrow: [],
    };
    this.finddim = this.finddim.bind(this);
    this.finddims = this.finddims.bind(this);
  }
  componentDidMount() {
    this.findRMPimages();
  }
  findRMPimages() {
    productService.findrmpimages({search: "", rmp_id: this.props.rmp_id, min: 0, max: 30, page: 1})
    .then(data => {
        var imagesize = this.finddims(data.products);
      this.setState({
        rmp_images: data.products,
       });
    });
  }
  finddims(simage) {
      var dims = []; 
      var singledim = {};
      for (var i = 0; i < Object.keys(simage).length; i++) {
        var imgsrc = `data:image/jpeg;base64,${simage[i].image}`
        this.finddim(simage[i]);
        }
  }
  finddim(simage) {
    var imgsrc = `data:image/jpeg;base64,${simage.image}`
    var newImg = new Image();
    newImg.onload = function() {
      var height = newImg.height;
      var width = newImg.width;
      var dimensions = this.state.dimensions;
      var objrow = this.state.objrow;
      var thumbnailheight = 200;
      // extend dimensions array for new image
      dimensions.push({width: newImg.width, height: newImg.height});
      var obj = {
        src: `data:image/jpeg;base64,${simage.image}`,
        thumbnail: `data:image/jpeg;base64,${simage.image}`,
        thumbnailHeight: thumbnailheight,
        thumbnailWidth: this.calcwidth({width: newImg.width, height: newImg.height}, thumbnailheight),
        tags: [{value: `${simage.title}`, title: `${simage.title}`}], 
        caption: `${simage.caption}`}
      objrow.push(obj);
      // update state dimensions
      this.setState({
        dimensions: dimensions,
        objrow: objrow,
      });
    }.bind(this)
    // this must be done AFTER setting onload
    newImg.src = imgsrc
  }
  calcwidth(dimensions, thumbnailheight) {
    //return 320
    var ratio = thumbnailheight/dimensions.height;
    return dimensions.width * ratio
  }
  render () {
    // make sure we have all images loaded before rendering the gallery
    if ( this.state.objrow[Object.keys(this.state.rmp_images).length - 1] == null ) {
      return (
        <div></div>
      );
    } else {
      return (
        <div className='dataproducts'>
        <table className='standard' cellPadding='5px' width='100%'>
        <tbody>
        <tr><th colSpan='3'>Data Products</th></tr>
        <tr><th colSpan='3'>
        <Gallery images={this.state.objrow}
                 enableImageSelection={false}
                 rowHeight={200}
                 margin={5}/>
                 </th></tr></tbody>
                 </table>
        </div>
      );
    }
  }
}


//  =========================================
//  Main react bootstrap table
//  =========================================
class ProdIdComponent extends React.Component {
  // Render a list of notes for the radio observations params
  constructor(props) {
    super(props);
    this.state = { prod_id: [],
    };
  }
  componentDidMount() {
    this.findProdId();
  }
  findProdId() {
    productService.findByProdId({search: "", prod_id: this.props.prod_id, min: 0, max: 30, page: 1})
    .then(data => {
      this.setState({
        prod_id: data.products,
      });
    });
  }
  render () {
          console.log(this.state.prod_id);
          if ( this.state.prod_id[0] == null ) {
            return (
            <div></div>
            );
          } else {
          return (
     <div>
        Notes:
      </div>
      );
    }
  }
}

//


export default class FRBTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showModal: false,
      meas: {},
      btnTitle: 'Verified events',
      btnTooltip: 'Only verified events are shown',
      verified: true,
      CSVFilename: 'frbcat',
      CSVExtension: 'csv',
      page: 1,
      sizePerPage: 25,
      hiddenColumns: {
        verified: true,
        obs_type: true,
        rop_receiver: true,
        rop_backend: true,
        rop_beam: true,
        rop_beam_semi_major_axis: true,
        rop_beam_semi_minor_axis: true,
        rop_beam_rotation_angle: true,
        rop_sampling_time: true,
        rop_npol: true,
        rop_bits_per_sample: true,
        rop_gain: true,
        rop_tsys: true,
        rop_mw_dm_limit: true,
        rop_galactic_electron_model: true,
        rop_bandwidth: true,
        rop_centre_frequency: true,
        rmp_flux: true,
        rmp_dm_index: true,
        rmp_scattering_index: true,
        rmp_scattering: true,
        rmp_scattering_model: true,
        rmp_scattering_timescale: true,
        rmp_linear_poln_frac: true,
        rmp_circular_poln_frac: true,
        rmp_spectral_index: true,
        rmp_rm: true,
        rmp_redshift_host: true,
        rmp_dispersion_smearing: true,
      },
      hiddenColumnsTemp: {
        verified: true,
        obs_type: true,
        rop_receiver: true,
        rop_backend: true,
        rop_beam: true,
        rop_beam_semi_major_axis: true,
        rop_beam_semi_minor_axis: true,
        rop_beam_rotation_angle: true,
        rop_sampling_time: true,
        rop_npol: true,
        rop_bits_per_sample: true,
        rop_gain: true,
        rop_tsys: true,
        rop_mw_dm_limit: true,
        rop_galactic_electron_model: true,
        rop_bandwidth: true,
        rop_centre_frequency: true,
        rmp_flux: true,
        rmp_dm_index: true,
        rmp_scattering_index: true,
        rmp_scattering: true,
        rmp_scattering_model: true,
        rmp_scattering_timescale: true,
        rmp_linear_poln_frac: true,
        rmp_circular_poln_frac: true,
        rmp_spectral_index: true,
        rmp_rm: true,
        rmp_redshift_host: true,
        rmp_dispersion_smearing: true,
      },
      product : {},
      arraylist: [],
      // dropdown
      selectedOption: {},
                   // schema
                   schema: {
  "type": "object",
  "title": "Configuration Parameters:",
  "description": "This is the LOFAR GRID Pre-Processing Pipeline. Here we print a description of the pipeline.",
  "properties": {
    "AVG_FREQ_STEP": {
      "type": "integer",
      "title": "AVG_FREQ_STEP",
      "description": "corresponds to .freqstep in NDPPP .type=average , or in case of .type=demixer it is the demixer.freqstep",
      "default": 2,
      "minimum": 0,
      "exclusiveMinimum": true,
      "maximum": 1000,
      "exclusiveMaximum": true,    
      "propertyOrder": 1
    },
    "AVG_TIME_STEP": {
      "type": "integer",
      "title": "AVG_TIME_STEP",
      "description": "corresponds to .timestep in NDPPP .type=average , or in case of .type=demixer it is the demixer.timestep",
      "default": 4,
      "minimum": 0,
      "exclusiveMinimum": true,
      "maximum": 1000,
      "exclusiveMaximum": true,    
      "propertyOrder": 2
    },
    "DO_DEMIX": {
      "type": "boolean",
      "title": "DO_DEMIX",
      "description": "if true then demixer instead of average is performed",
      "default": true,
      "propertyOrder": 3
    },
    "DEMIX_FREQ_STEP": {
      "type": "integer",
      "title": "DEMIX_FREQ_STEP",
      "description": "corresponds to .demixfreqstep in NDPPP .type=demixer",
      "default": 2,
      "minimum": 0,
      "exclusiveMinimum": true,
      "maximum": 1000,
      "exclusiveMaximum": true,    
      "propertyOrder": 4
    },
    "DEMIX_TIME_STEP": {
      "type": "integer",
      "title": "DEMIX_TIME_STEP",
      "description": "corresponds to .demixtimestep in NDPPP .type=demixer",
      "default": 2,
      "minimum": 0,
      "exclusiveMinimum": true,
      "maximum": 1000,
      "exclusiveMaximum": true,    
      "propertyOrder": 5
    },
    "DEMIX_SOURCES": {
      "type": "string",
      "description": "",
      "title": "DEMIX_SOURCES",
      "format": "select",
      "enum": [
        "CasA",
        "CygA"
      ],
      "propertyOrder": 6
    },
    "SELECT_NL": {
      "type": "boolean",
      "title": "SELECT_NL",
      "description": "if true then only Dutch stations are selected",
      "default": true,
      "propertyOrder": 7
    },
    "PARSET": {
      "type": "string",
      "title": "PARSET",
      "description": "",
      "format": "select",
      "enum": [
        "",
        "hba_npp",
        "hba_raw",
        "lba_npp",
        "lba_raw"
      ],
      "default": "lba_npp",
      "propertyOrder": 8
    },
    "required": [
        "AVG_FREQ_STEP",
        "AVG_TIME_STEP",
        "DO_DEMIX",
        "DEMIX_FREQ_STEP",
        "DEMIX_TIME_STEP",
        "DEMIX_SOURCES",
        "SELECT_NL",
        "PARSET"
    ]
    }},
    initialValue: {
        "AVG_FREQ_STEP": 2,
        "AVG_TIME_STEP": 4,
        "DO_DEMIX": true,
        "DEMIX_FREQ_STEP": 2,
        "DEMIX_TIME_STEP": 2,
        "DEMIX_SOURCES": "CasA",
        "SELECT_NL": true,
        "PARSET": "lba_npp"
    }
    };
    this.openColumnDialog = this.openColumnDialog.bind(this);
    this.applyColumnDialog = this.applyColumnDialog.bind(this);
    this.showall = this.showall.bind(this);
    this.closeColumnDialog = this.closeColumnDialog.bind(this);
    this.createCustomButtonGroup = this.createCustomButtonGroup.bind(this);
    this.getCSVFilename = this.getCSVFilename.bind(this);
    this.changeStateAttributeValue = this.changeStateAttributeValue.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.sizePerPageListChange = this.sizePerPageListChange.bind(this);
    this.customInfoButton = this.customInfoButton.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

    handleChange(selectedOption) {
    this.setState({ selectedOption });
    //console.log(`Selected: ${selectedOption.label}`);
  }

  customInfoButton(cell, row, enumObject, rowIndex) {
    return (
    <button type="button"
            style = {{ 'borderRadius': '50%', 'fontSize': '16px'}}
            className="btn btn-viscol"
            onContextMenu={this.openColumnDialog.bind(this, row)}
            onClick={this.openColumnDialog.bind(this, row)}>
  <span className="glyphicon glyphicon-info-sign"></span>
</button>
    );
  }
  getCSVFilename() {
    // define filename for export csv utility
    const datestamp = (new Date()).toISOString().slice(0,10).replace(/-/g,"")
    return this.state.CSVFilename + "_" + datestamp + "." + this.state.CSVExtension;
  }

  closeColumnDialog() {
    // undo changes and close modal
    var arrayLength = this.state['arraylist'].length;
    for (var i = 0; i < arrayLength; i++) {
      // undo changes
      var cname = this.state['arraylist'][i]
      this.changeStateAttributeValue('hiddenColumnsTemp', cname, this.state['hiddenColumns'][cname]);
    }
    // remove everything from arraylist
    this.setState({ arraylist: [] });
    // close modal
    this.setState({ showModal: false });    
  }

  applyColumnDialog() {
    // apply changes and close modal
    var arrayLength = this.state['arraylist'].length;
    for (var i = 0; i < arrayLength; i++) {
      // apply changes
      var cname = this.state['arraylist'][i]
      this.changeStateAttributeValue('hiddenColumns', cname, this.state['hiddenColumnsTemp'][cname]);
    }
    // remove everything from arraylist
    this.setState({ arraylist: [] });
    // close modal
    this.setState({ showModal: false });    
  }

  openColumnDialog(meas, e) {
      console.log(meas);
      this.setState({ showModal: true,
                      meas });
  }

  changeStateAttributeValue(stateName, attributeKey, attributeValue) {
    // changes a single attributes on a given state
    var newState = this.state; 
    var stateBeingChanged = this.state[stateName];
    stateBeingChanged[attributeKey] = attributeValue;
    newState[stateName] = stateBeingChanged;
    this.setState(newState);
  }

  changeState(stateName, value) {
    // changes a single state on a component given the state name and it’s new value
    var newState = {};
    newState[stateName] = value;
    this.setState(newState);  
  }

  changeColumnList(cname){
    // keep a list of visible columns to change
    return () => {
      var changeColList = this.state.arraylist;
      // find index in array
      var index = changeColList.indexOf(cname);
      if (index > -1) {
        // item in array, remove from array
        changeColList.splice(index, 1);
      } else {
      // add item to array
      changeColList.push(cname);
      }
      this.setState({ arraylist: changeColList });
      this.changeStateAttributeValue('hiddenColumnsTemp', cname, !this.state['hiddenColumnsTemp'][cname]);
    };
  }

  // pagination settings
  sizePerPageListChange(sizePerPage) {
    // set number of elements per page
    this.setState({sizePerPage: sizePerPage});
  }

  onPageChange(page, sizePerPage) {
    // set page number
    this.setState({page: page});
  }

  isExpandableRow(row) {
    return true;
  }

  handlerClickCleanFiltered() {
    // remove all filters
    this.refs.frb_name.cleanFiltered();
    this.refs.telescope.cleanFiltered();
    this.refs.utc.cleanFiltered();
    this.refs.rop_raj.cleanFiltered();
    this.refs.rop_decj.cleanFiltered();
    this.refs.rop_gl.cleanFiltered();
    this.refs.rop_gb.cleanFiltered();
    this.refs.rop_receiver.cleanFiltered();
    this.refs.rop_backend.cleanFiltered();
    this.refs.rop_beam.cleanFiltered();
    this.refs.rop_beam_semi_major_axis.cleanFiltered();
    this.refs.rop_beam_semi_minor_axis.cleanFiltered();
    this.refs.rop_beam_rotation_angle.cleanFiltered();
    this.refs.rop_sampling_time.cleanFiltered();
    this.refs.rop_bandwidth.cleanFiltered();
    this.refs.rop_centre_frequency.cleanFiltered();
    this.refs.rop_npol.cleanFiltered();
    this.refs.rop_bits_per_sample.cleanFiltered();
    this.refs.rop_gain.cleanFiltered();
    this.refs.rop_tsys.cleanFiltered();
    this.refs.rop_mw_dm_limit.cleanFiltered();
    this.refs.rop_galactic_electron_model.cleanFiltered();
    this.refs.rmp_dm.cleanFiltered();
    this.refs.rmp_width.cleanFiltered();
    this.refs.rmp_snr.cleanFiltered();
    this.refs.rmp_flux.cleanFiltered();
    this.refs.rmp_dm_index.cleanFiltered();
    this.refs.rmp_scattering_index.cleanFiltered();
    this.refs.rmp_scattering.cleanFiltered();
    this.refs.rmp_scattering_model.cleanFiltered();
    this.refs.rmp_scattering_timescale.cleanFiltered();
    this.refs.rmp_linear_poln_frac.cleanFiltered();
    this.refs.rmp_circular_poln_frac.cleanFiltered();
    this.refs.rmp_spectral_index.cleanFiltered();
    this.refs.rmp_rm.cleanFiltered();
    this.refs.rmp_redshift_host.cleanFiltered();
    this.refs.rmp_dispersion_smearing.cleanFiltered();
  }

  handleClearButtonClick(onClick) {
    this.props.search('');
  }

  showall(onClick) {
    if ( this.state.verified === true) {
        // set state to verified=false
        this.setState({verified: false});
        // change button title
        this.setState({btnTitle: 'All events'});
        // change button tooltip
        this.setState({btnTooltip: 'All events are shown'})
        // remove filter
        this.refs.verified.applyFilter('');
    } else {
        // set state to verified=true
        this.setState({verified: true});
        // change button title
        this.setState({btnTitle: 'Verified events'});
        // change button tooltip
        this.setState({btnTooltip: 'Only verified events are shown'})
        // apply filter
        this.refs.verified.applyFilter('true');
    }
  }

  createCustomClearButton(onClick) {
    return (
      <ClearSearchButton
      btnText='Clear'
      btnContextual='btn-warning'
      className='btn btn-search'
      onClick={ onClick }/>
    );
  }

  createCustomButtonGroup(props) {
    return (
      <ButtonGroup className='my-custom-class' sizeClass='btn-group-md'>
      <button type='button'
      className={ `btn btn-viscol` }
      title='Select visible columns'
      onClick={this.openColumnDialog}>
      Visible columns
      </button>
      <button type='button'
      title={this.state.btnTooltip}
      className={ `btn btn-info` }
      onClick={this.showall}>
      {this.state.btnTitle}
      </button>
      { props.exportCSVBtn }
      </ButtonGroup>    );
  }

  render() {
    const columns = [
                    {
                      dataField: 'button',
                      formatter: this.customInfoButton.bind(this),
                      text: '',
                      headerTitle: false,
                      headerStyle: (colum, colIndex) => {
                          return { width: '60px', textAlign: 'center' };
                      }
                    }, {
                      dataField: 'URI',
                      text: 'URI'
                    }, {
                      dataField: 'HASH',
                      text: 'HASH'
                    }, {
                      dataField: 'TYPE',
                      text: 'TYPE'
                    }, {
                      dataField: 'PRODUCTID',
                      text: 'PRODUCTID'
                    }, {
                      dataField: 'PROCESSID',
                      text: 'PROCESSID'
                    }];
    // set sorting options
    const options = {
      defaultSortName: 'frb_name',  // default sort column name
      defaultSortOrder: 'desc',  // default sort order
      onPageChange: this.onPageChange,
      onSizePerPageList: this.sizePerPageListChange,
      page: this.state.page,
      sizePerPage: this.state.sizePerPage,
      sizePerPageList: [ {
        text: '10', value: 10
      }, {
        text: '25', value: 25
      }, {
        text: '50', value: 50
      } ],
      prePage: 'Prev', // Previous page button text
      nextPage: 'Next', // Next page button text
      firstPage: 'First', // First page button text
      lastPage: 'Last', // Last page button text
      expandRowBgColor: '#B6C1C7',
      expandBy: 'row',
      clearSearch: true,
      clearSearchBtn: this.createCustomClearButton,
      btnGroup: this.createCustomButtonGroup,
    };
    // Define select column modal entries
    // don't recall db for each overview for now, too slow
    // <ProdIdComponent prod_id={this.state.meas.PRODUCTID} />

    return (
      <div className="reacttable">
        <Modal show={this.state.showModal} onHide={this.closeColumnDialg} dialogClassName="my-modal">
        <Modal.Header closeButton onClick={this.closeColumnDialog}>
        <Modal.Title>Observation overview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <table width='100%'>
          <tbody className='selectcol'>
            <tr>
              <td width='50%'>
                <table className='standard' cellPadding='5px' width='300px'>
                  <tbody>
                    <tr><th colSpan='3'>Product Parameters</th></tr>
                    <tr>
                      <td width='50%'><b>Product ID</b></td>
                      <td colSpan='2'>{this.state.meas.PRODUCTID}</td>
                    </tr>
                    <tr>
                      <td width='50%'><b>URI</b></td>
                      <td colSpan='2'>{this.state.meas.URI}</td>
                    </tr>
                    <tr>
                      <td width='50%'><b>HASH</b></td>
                      <td colSpan='2'>{this.state.meas.HASH}</td>
                    </tr>
                    <tr>
                      <td width='50%'><b>UTC</b></td>
                      <td colSpan='2'></td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
        <div className='dataprocessing'>
        <table className='standard' cellPadding='5px' width='100%'>
        <tbody>
        <tr><th colSpan='3'>Data Processing</th></tr>
        <tr><th colSpan='3'>
        <tr><td>Select processing pipeline:</td></tr>
        <Select
            name="form-field-name"
            value={this.state.selectedOption}
            onChange={this.handleChange}
            searchable={true}
            options={[
                      { value: 'LGPPP', label: 'LOFAR GRID Pre-Processing Pipeline' },
                      { value: 'two', label: 'Pipeline 2' },
                      { value: 'three', label: 'Pipeline 3' },
                      { value: 'four', label: 'Pipeline 4' },
                    ]}
            placeholder="Select pipeline..."
        />
        <PipelineConfigurator pipeline={this.state.selectedOption} />
</th></tr>
</tbody>
</table>
       </div>

        </Modal.Body>
        <Modal.Footer>
        <Button type="button" onClick={this.closeColumnDialog}>Close</Button>
        </Modal.Footer>
        </Modal>
        <BootstrapTable keyField = 'URI'
                        data = { this.props.products }
                        columns = { columns }
                        pagination={ paginationFactory() }
                        hover = { true } />
        </div>
    );
  }
}
