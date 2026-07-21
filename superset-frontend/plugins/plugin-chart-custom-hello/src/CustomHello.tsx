/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React, { useState, useMemo } from 'react';
import { styled, SupersetTheme } from '@apache-superset/core/theme';
import { CustomHelloProps, CustomHelloStylesProps } from './types';

const Styles = styled.div<CustomHelloStylesProps>`
  height: ${({ height }: CustomHelloStylesProps) => height}px;
  width: ${({ width }: CustomHelloStylesProps) => width}px;
  overflow: auto;
  padding: ${({ theme }: { theme: SupersetTheme }) => theme.padding}px;
  font-family: ${({ theme }: { theme: SupersetTheme }) => theme.fontFamily};
  background-color: ${({ theme }: { theme: SupersetTheme }) => theme.colorBgLayout};
  border-radius: ${({ theme }: { theme: SupersetTheme }) => theme.borderRadius}px;
`;

const Card = styled.div`
  background: #ffffff;
  border: 1px solid ${({ theme }: { theme: SupersetTheme }) => theme.colorBorderSecondary};
  border-radius: ${({ theme }: { theme: SupersetTheme }) => theme.borderRadius}px;
  padding: ${({ theme }: { theme: SupersetTheme }) => theme.padding}px;
  margin-bottom: ${({ theme }: { theme: SupersetTheme }) => theme.margin}px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const HeaderTitle = styled.h2<{ customColor?: string }>`
  margin: 0 0 ${({ theme }: { theme: SupersetTheme }) => theme.marginXS}px 0;
  color: ${({ customColor, theme }: { customColor?: string; theme: SupersetTheme }) => customColor || theme.colorPrimary};
  font-weight: ${({ theme }: { theme: SupersetTheme }) => theme.fontWeightStrong};
  font-size: ${({ theme }: { theme: SupersetTheme }) => theme.fontSizeLG}px;
  border-bottom: 2px solid ${({ theme }: { theme: SupersetTheme }) => theme.colorBorder};
  padding-bottom: ${({ theme }: { theme: SupersetTheme }) => theme.paddingXS}px;
`;

const MetricBadge = styled.span`
  background-color: ${({ theme }: { theme: SupersetTheme }) => theme.colorPrimaryBg};
  color: ${({ theme }: { theme: SupersetTheme }) => theme.colorPrimaryText};
  padding: ${({ theme }: { theme: SupersetTheme }) => theme.paddingXS / 2}px ${({ theme }: { theme: SupersetTheme }) => theme.paddingXS}px;
  border-radius: 12px;
  font-size: ${({ theme }: { theme: SupersetTheme }) => theme.fontSizeSM}px;
  font-weight: ${({ theme }: { theme: SupersetTheme }) => theme.fontWeightStrong};
  display: inline-block;
  margin-right: ${({ theme }: { theme: SupersetTheme }) => theme.marginXS}px;
  margin-bottom: ${({ theme }: { theme: SupersetTheme }) => theme.marginXXS}px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }: { theme: SupersetTheme }) => theme.paddingXS}px;
  border: 1px solid ${({ theme }: { theme: SupersetTheme }) => theme.colorBorderSecondary};
  border-radius: ${({ theme }: { theme: SupersetTheme }) => theme.borderRadius}px;
  margin-bottom: ${({ theme }: { theme: SupersetTheme }) => theme.margin}px;
  font-size: ${({ theme }: { theme: SupersetTheme }) => theme.fontSize}px;

  &:focus {
    outline: none;
    border-color: ${({ theme }: { theme: SupersetTheme }) => theme.colorPrimary};
  }
`;

const DataList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const DataRow = styled.div`
  padding: ${({ theme }: { theme: SupersetTheme }) => theme.paddingXS}px;
  border-bottom: 1px solid ${({ theme }: { theme: SupersetTheme }) => theme.colorBorder};
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }
`;

const GroupVal = styled.span`
  font-weight: normal;
  color: ${({ theme }: { theme: SupersetTheme }) => theme.colorText};
`;

const MetricVal = styled.span`
  font-weight: ${({ theme }: { theme: SupersetTheme }) => theme.fontWeightStrong};
  color: ${({ theme }: { theme: SupersetTheme }) => theme.colorPrimary};
`;

export default function CustomHello(props: CustomHelloProps) {
  const { data, height, width, headerText, headerColor, groupby, metrics } = props;
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lowerSearch = searchTerm.toLowerCase();
    return data.filter(row =>
      groupby.some(col => {
        const val = row[col];
        return val != null && String(val).toLowerCase().includes(lowerSearch);
      })
    );
  }, [data, groupby, searchTerm]);

  return (
    <Styles height={height} width={width}>
      <Card>
        <HeaderTitle customColor={headerColor}>
          {headerText || 'Hello from your Custom Chart!'}
        </HeaderTitle>
        <div style={{ marginBottom: '12px' }}>
          <strong>Total Records:</strong> {data.length} | <strong>Showing:</strong> {filteredData.length}
        </div>
        <div>
          {groupby.length > 0 && (
            <div style={{ marginBottom: '8px' }}>
              <strong>Grouped By:</strong>{' '}
              {groupby.map(col => (
                <MetricBadge key={col}>{col}</MetricBadge>
              ))}
            </div>
          )}
          {metrics.length > 0 && (
            <div>
              <strong>Metrics:</strong>{' '}
              {metrics.map(met => (
                <MetricBadge key={met}>{met}</MetricBadge>
              ))}
            </div>
          )}
        </div>
      </Card>

      {groupby.length > 0 && (
        <Card>
          <SearchInput
            type="text"
            placeholder="Search records by grouped columns..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
          <DataList>
            {filteredData.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '16px', color: '#888' }}>
                No matching records found.
              </div>
            ) : (
              filteredData.map((row, index) => {
                // Key construction
                const label = groupby.map(col => row[col]).join(' - ');
                // Find metric value
                const metricLabel = metrics.length > 0 ? String(row[metrics[0]] ?? '') : '';

                return (
                  <DataRow key={index}>
                    <GroupVal>{label || `Row ${index + 1}`}</GroupVal>
                    {metrics.length > 0 && (
                      <MetricVal>{metricLabel}</MetricVal>
                    )}
                  </DataRow>
                );
              })
            )}
          </DataList>
        </Card>
      )}
    </Styles>
  );
}
