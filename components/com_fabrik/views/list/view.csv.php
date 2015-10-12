<?php
/**
 * CSV Fabrik List view class
 *
 * @package     Joomla
 * @subpackage  Fabrik
 * @copyright   Copyright (C) 2005-2013 fabrikar.com - All rights reserved.
 * @license     GNU/GPL http://www.gnu.org/copyleft/gpl.html
 */

// No direct access
defined('_JEXEC') or die('Restricted access');

require_once JPATH_SITE . '/components/com_fabrik/views/list/view.base.php';

/**
 * CSV Fabrik List view class
 *
 * @package     Joomla
 * @subpackage  Fabrik
 * @since       3.0
 */
class FabrikViewList extends FabrikViewListBase
{
	/**
	 * Execute and display a template script.
	 *
	 * @param   string  $tpl  The name of the template file to parse; automatically searches through the template paths.
	 *
	 * @return  mixed  A string if successful, otherwise a JError object.
	 */
	public function display($tpl = null)
	{
		$app = JFactory::getApplication();
		$input = $app->input;
		$session = JFactory::getSession();

		/** @var FabrikFEModelCSVExport $exporter */
		$exporter = JModelLegacy::getInstance('Csvexport', 'FabrikFEModel');

		/** @var FabrikFEModelList $model */
		$model = JModelLegacy::getInstance('list', 'FabrikFEModel');
		$model->setId($input->getInt('listid'));

		if (!parent::access($model))
		{
			exit;
		}

		$model->setOutPutFormat('csv');
		$exporter->model = $model;
		$input->set('limitstart' . $model->getId(), $input->getInt('start', 0));
		$limit = $exporter->getStep();
		$input->set('limit' . $model->getId(), $limit);

		// $$$ rob moved here from csvimport::getHeadings as we need to do this before we get
		// the list total
		$selectedFields = $input->get('fields', array(), 'array');
		$model->setHeadingsForCSV($selectedFields);

		if (empty($model->asfields))
		{
			throw new LengthException('CSV Export - no fields found', 500);
		}

		$request = $model->getRequestData();
		$model->storeRequestData($request);

		$key = 'fabrik.list.' . $model->getId() . 'csv.total';
		$start = $input->getInt('start', 0);

		// If we are asking for a new export - clear previous total as list may be filtered differently
		if ($start === 0)
		{
			$session->clear($key);
		}

		if (!$session->has($key))
		{
			// Only get the total if not set - otherwise causes memory issues when we downloading
			$total = $model->getTotalRecords();
			$session->set($key, $total);
		}
		else
		{
			$total = $session->get($key);
		}

		if ($start < $total)
		{
			if ((int) $total === 0)
			{
				$notice = new stdClass;
				$notice->err = FText::_('COM_FABRIK_CSV_EXPORT_NO_RECORDS');
				echo json_encode($notice);

				return;
			}

			$canDownload = $start + $limit >= $total;
			$exporter->writeFile($total, $canDownload);

			if ($canDownload)
			{
				$this->download($model, $exporter, $key);
			}
		}
		else
		{
			$this->download($model, $exporter, $key);
		}

		return;
	}

	/**
     * Start the download process
     *
	 * @param   FabrikFEModelList       $model
	 * @param   FabrikFEModelCSVExport  $exporter
	 * @param   string                  $key
	 *
	 * @throws Exception
	 */
	protected function download($model, $exporter, $key)
	{
		$session = JFactory::getSession();
		$input = JFactory::getApplication()->input;
		$input->set('limitstart' . $model->getId(), 0);
		$download = $input->getBool('download', true);

		// Remove the total from the session
		$session->clear($key);

		if ($download)
		{
			$exporter->downloadFile();
		}
		else
		{
			$exporter->writeCSVFile();
		}

	}
}
